\name{pp_lifeForms}
\alias{pp_lifeForms}
\docType{data}
\title{Palyoplot sample of taxa groups and colors for plotting (data type: list)}
\description{Sample of taxa groups, group names, and colors used for plotting}
\usage{data("pp_lifeForms")}
\format{
  A data frame with 9 observations on the following 4 variables.
  \describe{
    \item{\code{id}}{a numeric vector}
    \item{\code{life_id}}{a factor with levels \code{a} \code{c} \code{h} \code{m} \code{o} \code{p} \code{s} \code{t} \code{x}}
    \item{\code{life_name}}{a factor with levels \code{Aquatic} \code{Control} \code{Herb} \code{Meadow} \code{Shrub} \code{Spore} \code{Stomate} \code{Tree} \code{Unknown}}
    \item{\code{color}}{a factor with levels \code{black} \code{burlywood4} \code{coral} \code{coral4} \code{darkcyan} \code{darkolivegreen3} \code{darkolivegreen4} \code{grey} \code{tan}}
  }
}
\examples{
data(pp_lifeForms)

taxaGroups = palyoplot_getTaxaGroups(pp_lifeForms, pp_taxaList, data=pp_xdata)

colors = palyoplot_getColorsGroups(colorGroups=pp_lifeForms, taxaGroups=taxaGroups,
                                   colorGroups.field.id='life_id', field.color='color')

}
\keyword{datasets}
