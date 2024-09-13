\name{palyoplot_setTaxaOrder}
\alias{palyoplot_setTaxaOrder}
\title{Set the order of taxa}
\description{Orders the taxa by group, then by order field. Can dynamically group taxa together if a taxaList.field.groupby value is provided.}
\usage{palyoplot_setTaxaOrder(
lifeForms,
taxaList,
data,
taxaList.field.id = 'taxa_id',
data.field.name = 'taxa_name',
taxaList.field.groupby = 'merge_under',
lifeForms.field.orderby = 'id',
taxaList.field.orderby = 'order',
field.id = 'life_id',
taxaList.field.return = 'taxa_name',
mergeData = TRUE
)}
\arguments{
  \item{lifeForms}{list of taxa groups. Includes primary key}
  \item{taxaList}{list of taxa. Must have a foreign key that associates with the primary key in lifeForms}
  \item{data}{the data for which you have counts. Column headers must be identical to the taxa in your taxaList object}
  \item{taxaList.field.id}{column name which corresponds to the primary key in the lifeForms object. Default 'taxa_id'}
  \item{data.field.name}{column name which corresponds to the name of the taxa. Default 'taxa_name'}
  \item{taxaList.field.groupby}{column name in taxaList object if taxa are to be dynamically merged. Default 'merge_under'}
  \item{lifeForms.field.orderby}{column name by which taxa groups in lifeForms should be ordered. Default 'id'}
  \item{taxaList.field.orderby}{column name by which taxa are ordered. Default 'order'}
  \item{field.id}{column name of primary key in lifeForms object. Default 'life_id'}
  \item{taxaList.field.return}{column name of field to return form lifeForms which contains the group name. Default 'life_name'}
  \item{mergeData}{should taxa be merged (pp_mergeDataUnder()) prior to sorting. Defaults to TRUE}
}
\value{ returns ordered object}
\author{Anna Klimaszewski-Patterson}
\examples{
  #set the order of taxa. Uses package variable pp_lifeForms, pp_taxaList, pp_xdata
  orderedData = palyoplot_setTaxaOrder(pp_lifeForms, pp_taxaList, data=pp_xdata)
}
