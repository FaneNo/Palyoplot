\name{palyoplot_getFontStyles}
\alias{palyoplot_getFontStyles}
\title{Get font styles based on taxa}
\description{Dynamically creates font styles to taxa. Requires an object which contains taxa and font styles accepted by ggplot2 (ex: 'plain', 'italic'. Generates data to be used by palyoplot_plotData()}
\usage{palyoplot_getFontStyles(
taxaList,
data,
taxaList.field.style = "fontstyle",
taxaList.field.text = "taxa_name"
)}
\arguments{
  \item{taxaList}{list of all taxa. Includes column with font style associated with the taxa}
  \item{data}{list of data with taxa names as column names. Name match with taxaList values}
  \item{taxaList.field.style}{name of column in taxaList object that has font styles. Default "fontstyle"}
  \item{taxaList.field.text}{name of column in taxaList object that corresponds with taxa in data object. Default "taxa_name"}
}
\value{returns character list of styles for each taxa to be plotted}
\author{Anna Klimaszewski-Patterson}
\seealso{
  \code{\link{palyoplot_plotTaxa}}
}
\examples{
    #create font styles. Uses package objects pp_taxaList, pp_xdata
    fontStyles = palyoplot_getFontStyles(pp_taxaList, data=pp_xdata)
}
