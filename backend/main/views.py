from django.shortcuts import render, redirect
from django.contrib.auth.models import User, Group
from django.contrib import messages
from rest_framework import viewsets, permissions, generics, status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken
from .serializers import RegisterSerializer, UserSerializer, MyTokenObtainPairSerializer#, GroupSerializer
# Create your views here.

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

'''
class GroupViewSet(viewsets.ModelViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    permission_classes = [permissions.IsAuthenticated]
'''
class MyObtainTokenPairView(TokenObtainPairView):
    permission_classes = (AllowAny,)
    serializer_class = MyTokenObtainPairSerializer

    # is this required?
    http_method_names = ['post']

    # post from react
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data) 

        try:    
            serializer.is_valid(raise_exception=True)           
        except TokenError as e:
            raise InvalidToken(e.args[0])

        return Response(serializer.validated_data, status=status.HTTP_200_OK)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (AllowAny,)
    serializer_class = RegisterSerializer
'''
def home(request):
    if request.user.is_authenticated:
        return render(request, "main/home.html")
    else:
        return redirect("main:login_request")

def login_request(request):
    if request.method == "POST":
        form = CustomAuthenticationForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.info(request, f"You are now logged in as {username}.")
                return redirect("main:home")
            else:
                messages.error(request, "Invalid username or password.")
        else:
            messages.error(request, "Invalid username or password.")
    form = CustomAuthenticationForm()
    return render(request, "main/login.html", {"login_form": form})

def logout_request(request):
    logout(request)
    messages.info(request, "You have successfully logged out.")
    return redirect("main:home")

def registration(request):
    if request.method == "POST":
        form = RegistrationForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, "Registration successful.")
            return redirect("main:home")
        messages.error(request, "Unsuccessful registration.")
    form = RegistrationForm()
    return render(request, "main/registration.html", {"registration_form": form})

'''