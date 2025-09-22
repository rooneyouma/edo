from django.contrib import admin
from .models import User, Role, LandlordProperty, Unit, Tenant, Payment, Notice, LandlordMaintenance, MaintenanceMessage, ChatMessage

class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'first_name', 'last_name', 'get_roles')
    search_fields = ('email', 'first_name', 'last_name')

    def get_roles(self, obj):
        return ", ".join([role.name for role in obj.roles.all()])
    get_roles.short_description = 'Roles'

admin.site.register(User, UserAdmin)
admin.site.register(Role)
admin.site.register(LandlordProperty)
admin.site.register(Unit)
admin.site.register(Tenant)
admin.site.register(Payment)
admin.site.register(Notice)
admin.site.register(LandlordMaintenance)
admin.site.register(MaintenanceMessage)
admin.site.register(ChatMessage)
