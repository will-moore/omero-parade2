#!/usr/bin/env python
#
# Copyright (c) 2025 University of Dundee.
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU Affero General Public License as
# published by the Free Software Foundation, either version 3 of the
# License, or (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU Affero General Public License for more details.
#
# You should have received a copy of the GNU Affero General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.
#

from django.http import HttpResponse
# from django.shortcuts import render
from django.template import loader
from django.templatetags import static
from django.urls import reverse

from omeroweb.decorators import login_required


# login_required: if not logged-in, will redirect to webclient
# login page. Then back to here, passing in the 'conn' connection
# and other arguments **kwargs.
@login_required()
def index(request, conn=None, **kwargs):
    # We can load data from OMERO via Blitz Gateway connection.
    # See https://docs.openmicroscopy.org/latest/omero/developers/Python.html
    experimenter = conn.getUser()

    # Load the template html and replace OMEROWEB_INDEX
    template = loader.get_template("omero_parade2/index.html")
    html = template.render({}, request)

    # update links to static files
    static_dir = static.static('omero_parade2/')
    html = html.replace('href="/assets/', 'href="%sassets/' % static_dir)
    html = html.replace('src="/assets/', 'src="%sassets/' % static_dir)
    html = html.replace('const STATIC_DIR = "";',
                        'const STATIC_DIR = "%s";' % static_dir[0:-1])

    omeroweb_index = reverse('index')
    # make url abosolute
    omeroweb_index = request.build_absolute_uri(omeroweb_index)
    html = html.replace('window.OMEROWEB_INDEX = undefined;',
                        'window.OMEROWEB_INDEX = "%s";' % omeroweb_index)

    # A dictionary of data to pass to the html template
    context = {
        "firstName": experimenter.firstName,
        "lastName": experimenter.lastName,
        "experimenterId": experimenter.id,
    }
    # print can be useful for debugging, but remove in production
    # print('context', context)

    # Render the html template and return the http response
    # return render(request, "omero_parade2/index.html", context)

    return HttpResponse(html)
