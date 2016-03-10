from flask import Blueprint


main = Blueprint('main', __name__, static_folder='static')  # First the blueprint name then module where located.


from . import views, errors  # imported at bottom of script to avoid circular dependencies
