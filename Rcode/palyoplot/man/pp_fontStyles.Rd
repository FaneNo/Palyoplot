\name{pp_fontStyles}
\alias{pp_fontStyles}
\docType{data}
\title{Palyoplot sample font style sequence (data type: list of characters)}
\description{Sequence of font styles to use when plotting taxa data (plain, italic)}
\usage{data("pp_fontStyles")}
\format{
  A data frame with 0 observations on the following 2 variables.
  \describe{
    \item{\code{x}}{a numeric vector}
    \item{\code{y}}{a numeric vector}
  }
}
\examples{
data(pp_fontStyles)

#get list of font styles based on taxa
palyoplot_getFontStyles(pp_taxaList, data=pp_xdata,
                        taxaList.field.style="fontstyle",
                        taxaList.field.text="taxa_name")
}
\keyword{datasets}
