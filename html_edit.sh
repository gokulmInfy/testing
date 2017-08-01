sed -i '/<div class="navbar-header">/,/<\/div>/d' ./reports/index.html
sed -i '/<div class="navbar-collapse collapse">/,/<\/div>/d' ./reports/index.html
sed -i '/<footer>/,/<\/footer>/d' ./reports/index.html
sed -i 's/href=\"[^"]*\"//g' ./reports/index.html

