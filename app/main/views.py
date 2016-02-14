"""
Evert application routes are stored in this module.
"""

from flask import render_template, session, redirect, url_for
from . import main
from .forms import NameForm

@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/upload', methods=['GET', 'POST'])
def upload():
    filename = None
    form = UploadForm()
    if form.validate_on_submit():
        filename = secure_filename(form.file.data.filename)
        form.file.data.save('uploads/' + filename)
        session['newUpload'] = filename  # This session library element serves to allow interactive feedback
        flash(filename + ' successfully uploaded to Evert.')
        return redirect(url_for('main.upload'))  # url_for() builds a URL to a specific function, html file irrelevant
    else:                                        # Now main.upload used as the function is relevant to a spec blueprint
        filename = None
    return render_template('upload.html', form=form)
