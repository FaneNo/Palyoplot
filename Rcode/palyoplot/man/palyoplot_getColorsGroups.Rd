\name{palyoplot_getColorsGroups}
\alias{palyoplot_getColorsGroups}
\title{Get colors based on taxa groups}
\description{Dynamically creates colors to assign to taxa based on taxa groups}
\usage{palyoplot_getColorsGroups(
colorGroups,
taxaGroups = NULL,
colorGroups.field.id = 'life_id',
field.color = 'color',
taxaList = NULL
)}
\arguments{
  \item{colorGroups}{list of all taxa groups and their associated ggplot2 colors}
  \item{taxaGroups}{list of used taxa groups and their counts. Built by palyoplot_getTaxaGroups(). Default NULL}
  \item{colorGroups.field.id}{primary key column name of colorGroups object which links with the 'name' foreign key in the taxaGroups object. Default 'life_id'}
  \item{field.color}{column name of the color field in the colorGroups object. Default 'color'}
  \item{taxaList}{list of taxa (if not using taxaGroups). Default NULL}
}
\value{ returns character list of a color for each taxa to be plotted}
\author{Anna Klimaszewski-Patterson}
\seealso{
  \code{\link{palyoplot_getTaxaGroups}},
  \code{\link{palyoplot_plotTaxa}}
}
\examples{
    #create taxa groups. Uses package objects pp_lifeForms, pp_taxaList, pp_xdata
    taxaGroups = palyoplot_getTaxaGroups(pp_lifeForms, pp_taxaList, data=pp_xdata)
    colors = palyoplot_getColorsGroups(colorGroups=pp_lifeForms, taxaGroups=taxaGroups)
}
