from django.contrib import admin
from django.contrib.auth import get_user_model

# Isto busca o modelo de utilizador que configuraste no AUTH_USER_MODEL
User = get_user_model()

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'is_authority', 'station_name')
    list_editable = ('is_authority', 'station_name') # Permite editar direto na lista
    search_fields = ('email', 'first_name')

