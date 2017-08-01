sed -e '/<div class="navbar-header">/,/<\/div>/d' reports/index.html > reports/index1.tmp
mv reports/index1.tmp reports/index.html
sed -e '/<div class="navbar-collapse collapse">/,/<\/div>/d' reports/index.html > reports/index1.tmp
mv reports/index1.tmp reports/index.html
sed -e '/<footer>/,/<\/footer>/d' reports/index.html > reports/index1.tmp
mv reports/index1.tmp reports/index.html
sed -e 's/href=\"[^"]*\"//g' reports/index.html > reports/index1.tmp
mv reports/index1.tmp reports/index.html
