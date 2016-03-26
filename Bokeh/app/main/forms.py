from flask.ext.wtf import Form
from wtforms import FileField, SubmitField
from wtforms.validators import Required


class UploadForm(Form):
    file = FileField('CSV file', validators=[Required()])
    submit = SubmitField('Submit')
# #################################################
# Specific web forms to be added to pages are defined as classes and passed to html files for rendering
# #################################################