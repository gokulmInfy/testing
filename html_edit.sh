sed -e '/<div class="navbar-header">/,/<\/div>/d' ./reports/index.html > ./reports/index1.tmp
mv ./reports/index1.tmp ./reports/index.html
sed -e '/<div class="navbar-collapse collapse">/,/<\/div>/d' ./reports/index.html > ./reports/index1.tmp
mv ./reports/index1.tmp ./reports/index.html
sed -e '/<div class="container-fluid">/,/<\/div>/d' ./reports/index.html > ./reports/index1.tmp
mv ./reports/index1.tmp ./reports/index.html
sed -e '/<div class="navbar navbar-default"/,/<\/div>/d' ./reports/index.html > ./reports/index1.tmp
mv ./reports/index1.tmp ./reports/index.html
sed -e '/<footer>/,/<\/footer>/d' ./reports/index.html > ./reports/index1.tmp
mv ./reports/index1.tmp ./reports/index.html
sed -e 's/\"\_blank\" href=\"[^"]*\"//g' ./reports/index.html > ./reports/index1.tmp
mv ./reports/index1.tmp ./reports/index.html
sed -e 's/row/row1/g' ./reports/index.html > ./reports/index1.tmp
mv ./reports/index1.tmp ./reports/index.html
sed -e 's/dataTable/dataTable111/g' ./reports/index.html > ./reports/index1.tmp
mv ./reports/index1.tmp ./reports/index.html
sed -e 's/\/static\//\.ws\/reports\/\/static\//g' ./reports/index.html > ./reports/index1.tmp
mv ./reports/index1.tmp ./reports/index.html
