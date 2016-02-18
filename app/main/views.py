"""
Evert application routes are stored in this module.
"""

from flask import render_template, session, redirect, url_for, flash
from . import main
from .forms import UploadForm
from werkzeug.utils import secure_filename
from pandas import read_csv
from numpy import linspace, exp
from pandas import DataFrame
from bokeh.plotting import figure
from bokeh.embed import components


@main.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@main.route('/upload', methods=['GET', 'POST'])
def upload():
    filename = None
    form = UploadForm()
    if form.validate_on_submit():
        filename = secure_filename(form.file.data.filename)
        form.file.data.save('app/uploads/' + filename)
        session['newUpload'] = filename  # This session library element serves to allow interactive feedback
        flash(filename + ' successfully uploaded to Evert.')
        return redirect(url_for('main.upload'))  # url_for() builds a URL to a specific function, html file irrelevant
    else:                                        # Now main.upload used as the function is relevant to a spec blueprint
        filename = None
    return render_template('upload.html', form=form)


# Try to directly embed into HTML whilst still making use of Bootstrap
@main.route('/plot', methods=['GET'])
def plot():

    # Prepare Data
    #xdata = linspace(0, 100, 100)

    #K = 3
    #tau = 20
    #ydata = K*(1-exp(-xdata/tau))

    #Data_pandas = DataFrame({'Time': xdata,
    #                         'Value': ydata})

    #Data_pandas.to_csv('app/static/uploads/Data1.csv')

    # Read data as if uploaded file is now used
    data = read_csv('app/static/uploads/Data1.csv', sep=',', skipinitialspace=1)

    xdata = data.values[:,1]    # Extract Data
    ydata = data.values[:,2]

    my_plot = figure()          # Create figure object
    my_plot.circle(xdata, ydata)  # Add circle elements (glyphs) to the figure

    script, div = components(my_plot)  # Break figure up into component HTML to be added to template

    return render_template("int_scatter.html", myScript=script, myDiv=div)