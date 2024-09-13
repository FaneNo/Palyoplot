\name{palyoplot_getTaxaNamesByGroup}
\alias{palyoplot_getTaxaNamesByGroup}
\title{Grab taxa names based on their taxa group}
\description{Grabs taxa names based on which taxa group they're assigned to}
\usage{palyoplot_getTaxaNamesByGroup(
data,
taxaList,
group,
group.field.id = 'life_id',
taxaList.field.id = "taxa_name",
convertColHeader = TRUE
)}
\arguments{
  \item{data}{data.frame of count data with taxa names as column names}
  \item{taxaList}{list of taxa. Must have a foreign key that associates with the primary key in lifeForms}
  \item{group}{list of taxa group values located in the column value of groupId}
  \item{group.field.id}{name of column in taxaList object corresponding with values in group object. Default 'life_id'}
  \item{taxaList.field.id}{name of column to return value. Default 'taxa_name'}
  \item{convertColHeader}{Replace '.' in taxa column names with ' '. Default TRUE}
}
\value{ returns list of taxa names}
\author{Anna Klimaszewski-Patterson}
\examples{
    #get list of taxa based of their taxa group
    arboreal = palyoplot_getTaxaNamesByGroup(data=pp_xdata,
                                             taxaList=pp_taxaList,
                                             group=c('t', 's'),
                                             group.field.id='life_id',
                                             taxaList.field.id="taxa_name")
}
