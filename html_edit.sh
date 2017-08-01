sed -i '/<div class="navbar-header">/,/<\/div>/d' ./reports/index.htm
sed -i '/<div class="navbar-collapse collapse">/,/<\/div>/d' ./reports/index.htm
sed -i '/<footer>/,/<\/footer>/d' ./reports/index.htm
sed -i 's/href=\"[^"]*\"//g' ./reports/index.htm

