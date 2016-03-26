"""
Evert application routes are stored in this module.
"""

from flask import render_template, session, redirect, url_for, flash
from . import main
from .forms import UploadForm
from werkzeug.utils import secure_filename
from pandas import read_csv
from numpy import linspace, exp, sin
from pandas import DataFrame
from bokeh.plotting import figure
from bokeh.embed import components
from bokeh.models import CustomJS, ColumnDataSource, Range1d, LinearAxis
from bokeh.models.tools import BoxSelectTool, PanTool, ResetTool, WheelZoomTool, BoxZoomTool



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

    # Read data as if uploaded file is now used, Data set 1
    data1 = read_csv('app/static/uploads/Data1.csv', sep=',', skipinitialspace=1)

    xdata1 = data1.values[:,1]    # Extract Data
    ydata1 = data1.values[:,2]
    colour1 = ['black']*len(xdata1)

    # Read data as if uploaded file is now used, Data set 2
    data2 = read_csv('app/static/uploads/Data2.csv', sep=',', skipinitialspace=1)

    xdata2 = data2.values[:,1]
    ydata2 = data2.values[:,2]
    colour2 = ['green']*len(xdata2)

    # Read data as if uploaded file is now used, Data set 3
    data3 = read_csv('app/static/uploads/Data3.csv', sep=',', skipinitialspace=1)

    xdata3 = data3.values[:,1]
    ydata3 = data3.values[:,2]
    colour3 = ['red']*len(xdata3)

    # Prepare Data3
    # xdata3 = linspace(0, 100, 10)
    # ydata3 = sin(10*xdata3)

    # Data_pandas = DataFrame({'Time': xdata3,
    #                        'Value': ydata3})

    # Data_pandas.to_csv('app/static/uploads/Data3.csv')


    # Assign read data to ColumnDataSource objects
    sourceData1 = ColumnDataSource(data=dict(x=xdata1, y=ydata1, color=colour1))
    sourceData2 = ColumnDataSource(data=dict(x=xdata2, y=ydata2, color=colour2))
    sourceData3 = ColumnDataSource(data=dict(x=xdata3, y=ydata3, color=colour3))

    my_plot = figure(tools=[BoxSelectTool(dimensions=['width'], select_every_mousemove=True), PanTool(), ResetTool(), WheelZoomTool(), BoxZoomTool()],
                     title='Time series data',
                     x_range=(xdata1.min(), xdata1.max()),
                     y_range=(ydata1.min(), ydata1.max()),
                     width=1200)      # Create figure object; DEBUG: select_every_mousemove=False

    my_plot.extra_y_ranges = {# 'Data1': Range1d(start=ydata1.min(), end=ydata1.max()),
                              'Data2': Range1d(start=ydata2.min(), end=ydata2.max()),
                              'Data3': Range1d(start=ydata3.min(), end=ydata3.max())}

    my_plot.circle(x='x', y='y', color='color', source=sourceData1,
                   size=8, alpha=0.8, legend='Data 1')  # Add circle elements (glyphs) to the figure

    my_plot.circle(x='x', y='y', color='color', source=sourceData2,
                   size=5, alpha=0.8, y_range_name='Data2', legend='Data 2')

    my_plot.circle(x='x', y='y', color='color', source=sourceData3,
                   size=8, alpha=0.5, y_range_name='Data3', legend='Data 3')
    my_plot.line(x='x', y='y', color='red', source= sourceData3,
                 alpha=0.5, y_range_name='Data3', legend='Data 3')


    sourceFit = ColumnDataSource(data=dict(xfit=[], yfit=[]))
    my_plot.circle(x='xfit', y='yfit', source=sourceFit, color='orange', alpha=0.3)

    # my_plot.add_layout(LinearAxis(y_range_name='Data1', axis_line_color=colour1[0]), 'left')
    my_plot.add_layout(LinearAxis(y_range_name='Data2', axis_line_color=colour2[0], axis_line_width=3), 'left')
    my_plot.add_layout(LinearAxis(y_range_name='Data3', axis_line_color=colour3[0], axis_line_width=3), 'left')


    # sourceAnnotate = ColumnDataSource(data=dict(text=['Foo', 'Bah'], x=[50, 50], y=[0.5, 0], x_offset=[0,0], y_offset=[0,0], text_font_size=['15pt', '15pt'],

    #                                            text_color=['orange', 'orange']))
    # my_plot.text(source=sourceAnnotate, text='text', x='x', y='y', x_offset='x_offset', y_offset='y_offset', text_font_size='text_font_size', text_color='text_color')

    sourceData1.callback = CustomJS(args=dict(sourceFit=sourceFit), code=("""FirstOrderEyeball(cb_obj, sourceFit)"""))

    # sourceData.callback = CustomJS(args=dict(sourceFit=sourceFit, sourceAnnotate=sourceAnnotate), code=("""FirstOrderEyeball(cb_obj, sourceFit, sourceAnnotate)"""))

    script, div = components(my_plot)  # Break figure up into component HTML to be added to template
    return render_template("int_scatter.html", myScript=script, myDiv=div)