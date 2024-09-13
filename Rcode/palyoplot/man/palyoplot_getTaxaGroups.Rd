\name{palyoplot_getTaxaGroups}
\alias{palyoplot_getTaxaGroups}
\title{Organize taxa groups. For use with palyoplot_plotData()}
\description{Dynamically creates a list of taxa groups used, and a count of the number of each taxa within each group.
    Used when you want to have taxa group headers on the plot (ex: ---Trees-- --Shrubs-- --Herbs--, etc)}
\usage{palyoplot_getTaxaGroups(
lifeForms,
taxaList,
data,
data.taxa.col.start = 1,
data.taxa.col.end = NULL,
taxaList.field.id = 'taxa_id',
taxaList.field.groupby = 'merge_under',
lifeForms.field.orderby = 'id',
taxaList.field.orderby = 'order',
field.id = 'life_id',
taxaList.field.return = 'life_name'
)}
\arguments{
  \item{lifeForms}{list of taxa groups. Includes primary key}
  \item{taxaList}{list of taxa. Must have a foreign key that associates with the primary key in lifeForms}
  \item{data}{the data for which you have counts. Column headers must be identical to the taxa in your taxaList object}
  \item{data.taxa.col.start}{column index for where your taxa begin in the data object. Default 1}
  \item{data.taxa.col.end}{column index for the last column of taxa. Default NULL (length of data object)}
  \item{taxaList.field.id}{column name which corresponds to the primary key in the lifeForms object. Default 'taxa_id'}
  \item{taxaList.field.groupby}{column name in taxaList object if taxa are to be dynamically merged. Default 'merge_under'}
  \item{lifeForms.field.orderby}{column name by which taxa groups in lifeForms should be ordered. Default 'id'}
  \item{taxaList.field.orderby}{column name by which taxa are ordered. Default 'order'}
  \item{field.id}{column name of primary key in lifeForms object. Default 'life_id'}
  \item{taxaList.field.return}{column name of field to return form lifeForms which contains the group name. Default 'life_name'}
}
\value{
  \item{name}{value of taxaIdField}
  \item{count}{number of taxa in the taxa group}
  \item{longname}{value of returnField}
}
\author{Anna Klimaszewski-Patterson}
\note{Taxa groups assumes that taxa will be plotted by group. These taxa MUST be ordered so as to be adjacent (use palyplot_setTaxaOrder() first).
    Based on data in taxaList, taxa are sorted by group, merged if necessary (groupByField), and counts of the
    number of taxa in each group are returned. This function allows for dynamic processing of data which are
    used by palyoplot_plotData()
}
\seealso{
  \code{\link{palyoplot_plotTaxa}}
}
\examples{
    #get ordered data for plotting
    orderedData = palyoplot_setTaxaOrder(pp_lifeForms, pp_taxaList, data=pp_xdata)

    #create taxa groups based on ordered data (to allow for grouping.
    #Uses package objects pp_lifeForms, pp_taxaList, pp_xdata
    taxaGroups = palyoplot_getTaxaGroups(pp_lifeForms, pp_taxaList, data=orderedData)
}
