from django.core.management.base import BaseCommand
from django.db import connection

class Command(BaseCommand):
    help = 'Remove orphaned user-role mappings from edoAPI_user_roles where role_id does not exist in edoAPI_role.'

    def handle(self, *args, **options):
        with connection.cursor() as cursor:
            self.stdout.write('Cleaning up orphaned user-role mappings...')
            cursor.execute('''
                DELETE FROM edoAPI_user_roles
                WHERE role_id NOT IN (SELECT id FROM edoAPI_role)
            ''')
            self.stdout.write(self.style.SUCCESS('Orphaned user-role mappings cleaned up successfully.')) 