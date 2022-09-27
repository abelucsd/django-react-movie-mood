from django.contrib.auth.models import User, Group
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers, status
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User        
        fields = ['id', 'username', 'first_name', 'last_name', 'email']

'''
class GroupSerializer(serializers.HyperlinkedModelSerializer):
    class Meta:
        model = Group
        fields = ['url', 'name']
'''

# To register User
class RegisterSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(
        required=True,
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True, required=True, validators=[validate_password]    
    )
    password2 = serializers.CharField(
        write_only=True, required=True
    )

    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError(
                {'password': 'Password fields didn\'t match.'}
            )
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):

    # validate the login
    def validate (self, attrs):
        data = super().validate(attrs)
        token = self.get_token(self.user)
        data['user'] = UserSerializer(self.user).data
        data['refresh'] = str(token)
        data['access'] = str(token.access_token)
        return data

    @classmethod
    def get_token(cls, user):

        # Need User information
        # Could make it all at once.
        # In frontend: 
        '''
            Login with username and password .post(url, {username, password})
            .then ((res) => {
                res.data would only contain token
                The only data this serializer requires is the username and password to generate a token
                However we could include the username's data too.
            })
        '''
        # validate username password            
        # only returning a token.
        token = super(MyTokenObtainPairSerializer, cls).get_token(user)

        # Add custom claims
        token['username'] = user.username
        return token