from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django import forms
from .models import User

# Formularia customizado para garantir que o Django não procure o 'username' ao criar
class CustomUserCreationForm(forms.ModelForm):
    class Meta:
        model = User
        fields = ('email', 'first_name', 'last_name', 'is_authority', 'station_name', 'is_active')

    def save(self, commit=True):
        user = super().save(commit=False)
        # Força o Django a encriptar a password corretamente antes de salvar
        if self.cleaned_data["password"]:
            user.set_password(self.cleaned_data["password"])
        if commit:
            user.save()
        return user

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    # Usa o nosso formulário limpo para novas contas
    add_form = CustomUserCreationForm
    
    list_display = ('email', 'first_name', 'last_name', 'is_authority', 'station_name', 'is_active')
    list_editable = ('is_authority', 'station_name', 'is_active')
    ordering = ('email',)
    search_fields = ('email', 'first_name', 'last_name')

    fieldsets = (
        ('Credenciais', {'fields': ('email', 'password')}),
        ('Informações Pessoais', {'fields': ('first_name', 'last_name')}),
        ('Informações de Autoridade', {'fields': ('is_authority', 'station_name')}),
        ('Permissões', {'fields': ('is_active', 'is_staff', 'is_superuser')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password', 'first_name', 'last_name', 'is_authority', 'station_name', 'is_active', 'is_staff', 'is_superuser'),
        }),
    )