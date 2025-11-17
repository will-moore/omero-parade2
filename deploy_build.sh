#!/bin/bash

echo "Deploying built resources to plugin directory..."

# Copy output from dist/ to Django app
mkdir -p omero_parade2/templates/omero_parade2/
cp dist/index.html omero_parade2/templates/omero_parade2/

mkdir -p omero_parade2/static/omero_parade2/assets/
cp dist/assets/* omero_parade2/static/omero_parade2/assets/
