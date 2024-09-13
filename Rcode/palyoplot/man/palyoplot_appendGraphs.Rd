\name{palyoplot_appendGraphs}
\alias{palyoplot_appendGraphs}
\title{Append Palyoplot graphs together.}
\description{Append multiple Palyoplots together into a single graphic. May want to disable y-axis on any plots beyond the first. Individual plots must be created first and stored in an R variable.}
\usage{palyoplot_appendGraphs(arr, height=NULL, widths=NULL)}
\arguments{
  \item{arr}{REQ: list of plots to append together}
  \item{height}{height of final graph in unit(). Ex: unit(14, "cm") }
  \item{widths}{list of widths of graphs to be appended, in unit(). Ex: unit(c(5, 2, 2), "cm")) for 3 appended graphs}
}
\value{returns ggplot object}
\author{Anna Klimaszewski-Patterson}
\seealso{
  \code{\link{palyoplot_plotTaxa}}
  \code{\link{palyoplot_plotStackedTaxa}}
  \code{\link{palyoplot_plotIndex}}
}
\examples{
## using package data
myTrees = pp_xdata[,1:5] #Just the tree taxa from our study
colorsTrees = c("#333300", "#666600", "#ffff66", "#aaaa33", "#cccc66")
gT = palyoplot_plotStackedTaxa(x=myTrees, y=pp_ydata,
                               title="Arboreal Taxa\nPine/Cupressaceae/Ash/Fir/Oak",
                               ylim=c(-20,115), y.label=" cal yr BP", x.label="Percentages",
                               plot.style="area", colors=colorsTrees)

myHerbs = pp_xdata[,8:9] #Just the herb taxa from our study
colorsHerbs = c("#009933", "#99ff99")
gH = palyoplot_plotStackedTaxa(x=myHerbs, y=pp_ydata,
                               title="Herbs\nAster/Grass", title.gpar = gpar(fontsize = 11),
                               ylim=c(-20,115), y.label="", x.label="",
                               plot.style="area", colors=colorsHerbs, y.show=FALSE)

gAppend = palyoplot_appendGraphs(arr=list(gT, gH), height=unit(16, "cm"),
                                 widths=unit(c(11,2.1), "cm"))
}
