\name{palyoplot_mergeDataUnder}
\alias{palyoplot_mergeDataUnder}
\title{Merge data based on a common code}
\description{Merges the taxa values based on a common code. Used to reformat data}
\usage{palyoplot_mergeDataUnder(
data,
taxaList,
taxaList.field.groupby = 'merge_under',
taxaList.field.id = "taxa_id",
data.field.name = "taxa_name"
)}
\arguments{
  \item{data}{the data for which you have counts. Column headers must be identical to the taxa in your taxaList object}
  \item{taxaList}{list of taxa. Must have a foreign key that associates with the primary key in lifeForms}
  \item{taxaList.field.groupby}{column name in taxaList object if taxa are to be dynamically merged. Default 'merge_under'}
  \item{taxaList.field.id}{column name which corresponds to the primary key in the lifeForms object. Default 'taxa_id'}
  \item{data.field.name}{column name which corresponds to the name of the taxa. Default 'taxa_name'}
}
\value{ returns ordered object}
\author{Anna Klimaszewski-Patterson}
\examples{
  #merges taxa values together. Uses package variable pp_taxaList, pp_xdata
  mergedData = palyoplot_mergeDataUnder(data=pp_xdata, taxaList=pp_taxaList)
}
