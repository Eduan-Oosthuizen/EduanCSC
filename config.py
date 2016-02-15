import os

basdir = os.path.abspath(os.path.dirname(__file__))


class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'hard to guess string'
    EVERT_ADMIN = os.environ.get('EVERT_ADMIN')
# ################################################
# A note on Cross-Site Request Forgery  protection:
# The is applied by default by the flask-wtf extension and therefore the SECRET_KEY is supplied. Not adding this key
# results in an error when rendering the html files associated with this application.
# ################################################

    @staticmethod
    def init_app(app):
        pass  # Configuration specific initialization- empty now

class DevelopmentConfig(Config):
    DEBUG = True

config = {
    'development': DevelopmentConfig,

    'default': DevelopmentConfig
}
