\name{pp_taxaGroups}
\alias{pp_taxaGroups}
\docType{data}
\title{Palyoplot sample of taxa groups and the number of taxa in each group (data type: list)}
\description{List of taxa groups and the number of taxa within each group (for use with palyoplot_plotData())}
\usage{data("pp_taxaGroups")}
\format{
  A data frame with 5 observations on the following 3 variables.
  \describe{
    \item{\code{name}}{a factor with levels \code{a} \code{c} \code{h} \code{m} \code{o} \code{p} \code{s} \code{t} \code{x} \code{z}}
    \item{\code{count}}{a numeric vector}
    \item{\code{longname}}{a factor with levels \code{Aquatic} \code{Control} \code{Herb} \code{Meadow} \code{Shrub} \code{Spore} \code{Stomate} \code{Tree} \code{Unknown}}
  }
}
\examples{
data(pp_taxaGroups)

colors = palyoplot_getColorsGroups(colorGroups=pp_lifeForms, taxaGroups=pp_taxaGroups,
                                   colorGroups.field.id='life_id', field.color='color')


}
\keyword{datasets}
