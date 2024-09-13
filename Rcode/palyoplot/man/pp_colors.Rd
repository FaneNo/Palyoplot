\name{pp_colors}
\alias{pp_colors}
\docType{data}
\title{Palyoplot sample color sequence (data type: list of characters)}
\description{Sequence of colors to use when plotting taxa data}
\usage{data("pp_colors")}
\format{
  A sequence with 9 observations
  \describe{
    \item{\code{}}{character list with values \code{"coral4"} \code{"coral4"} \code{"coral4"} \code{"coral4"} \code{"coral"} \code{"darkolivegreen4"} \code{"grey"} \code{"grey"} \code{"darkolivegreen3"}}
  }
}
\examples{
data(pp_colors)

#get list of colors by taxa groups
palyoplot_getColorsGroups(colorGroups=pp_lifeForms, taxaGroups=pp_taxaGroups,
                          colorGroups.field.id='life_id', field.color='color')
}
\keyword{datasets}
