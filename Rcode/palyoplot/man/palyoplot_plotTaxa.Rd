\name{palyoplot_plotTaxa}
\alias{palyoplot_plotTaxa}
\title{Plot taxa}
\description{Plot multiple taxa. Supports multi y-axes}
\usage{palyoplot_plotTaxa(
x,
y,
y.label,
ylim = NULL,
y.show = TRUE,
y.break = NULL,
y2 = NULL,
y2.label = NULL,
x.break = 10,
x.reverse = FALSE,
x.label = NULL,
x.label.height = .5,
x.label.text.gpar = gpar(fontsize = 10),
x.label.pos = 'bottom',
x.tickwidth=1,
zones = NULL,
zones.anno.width = .75,
taxaGroups = NULL,
taxaGroups.height = .75,
taxaGroups.text.gpar = gpar(fontsize = 8),
display.height = NULL,
display.width = NULL,
plot.style = 'area',
plot.style.bar.width = 5,
plot.style.point.color = NULL,
plot.color.fill = TRUE,
plot.font.styles = NULL,
plot.font.style = 'plain',
plot.height = 10,
plot.spacer = .25,
plot.vspacer = .25,
top.label.height = 2.25,
axis.text.size = 8,
axis.title.size = 12,
axis.title.x.fontstyle = 'plain',
axis.title.x.angle = 45,
axis.title.x.just = c("center", "top"),
axis.title.x.hjust = 0.01,
axis.title.x.vjust = 0.5,
axis.title.x.margin = -35,
axis.title.y = 8,
axis.title.y.angle = 90,
axis.title.y.hjust = 0.1,
axis.title.y.vjust = 0,
colors = NULL,
color.default = 'grey60',
line.e10x = 'cornsilk3',
clust = NULL
)}
\arguments{
  \item{x}{REQ: the data <taxa> (in columns) to plot}
  \item{y}{REQ: first column in ydata is the main y-axis}
  \item{y.label}{REQ: label for primary y-axis}
  \item{ylim}{limits on y-axis (ex: c(2000, 0)). Default NULL}
  \item{y.show}{Show y-axis (TRUE/FALSE). Default TRUE}
  \item{y.break}{y-tick break every how many years (ex: 100). Default NULL}
  \item{y2}{secondary axis information. Built by palyoplot_get2ndAxis(). Default NULL}
  \item{y2.label}{label for the secondary y-axis.Default NULL}
  \item{x.break}{x-tick break every how many units. Default 10}
  \item{x.reverse}{Reverse x-axis. Default FALSE}
  \item{x.label}{label to place under all plots for x-axis (ex: percentages). Default NULL}
  \item{x.label.height}{value in cm for the height of x.label. Default .5}
  \item{x.label.text.gpar}{label text formatting. Default gpar(fontsize = 10)}
  \item{x.label.pos}{NOT YET IMPLEMENTED. Default 'bottom'}
  \item{x.tickwidth}{how wide is each x-axis tick block (in cm). Default = 1 (ex: 1 = 1cm/10 percent tick)}
  \item{zones}{lines for taxa zonation, if known. Built as a data.frame that includes solumns "axisVal" (req. Axis intercept), "ltype" (line type. Default "solid"), "lcolor" (line color. Default grey50), "annoText" (zone label), "annoColor" (text color. Default grey50), "annoAxis" (alignment of text on axis), "axisOffset" (offset from other axis for display positioning)). Default NULL}
  \item{zones.anno.width}{width of column for zone annotation (in cm). Default .75}
  \item{taxaGroups}{data.frame of taxa lifeforms by name and count of columns (name, count). Can be bult by palyoplot_getTaxaGroups()}
  \item{taxaGroups.height}{height of taxa groups label, in cm}
  \item{taxaGroups.text.gpar}{font size for taxa groups text, in gpar format (ex: gpar(fontsize = 8))}
  \item{display.height}{height of plot. Default NULL. Ex: unit(5, "in")}
  \item{display.width}{width of plot. Default NULL}
  \item{plot.style}{Style of plot (area, line, point, bar). Default area}
  \item{plot.style.bar.width}{Width of plotted bars (requires plotStyle='bars'. Default 5}
  \item{plot.style.point.color}{Color of points is style='point'. Default NULL taxa color used}
  \item{plot.color.fill}{Whether plot is filled. Default TRUE. If FALSE, apply color to symbology}
  \item{plot.font.styles}{list of font styles to apply to xdata labels (plain, italic) See ggplot2 parameters. Can be built with palyoplot_getFontStyles()}
  \item{plot.font.style}{default font style to apply to xdata labels. Default 'plain'}
  \item{plot.height}{height of the plot itself. In cm}
  \item{plot.spacer}{space between plots (in cm)}
  \item{plot.vspacer}{vertical space between plots (in cm)}
  \item{top.label.height}{height of xdata labels, in cm. Use if groups labels are overlapping taxa labels. Default=2.25}
  \item{axis.text.size}{font size of axis text}
  \item{axis.title.size}{font size of axis title}
  \item{axis.title.x.fontstyle}{font style. Default 'plain'}
  \item{axis.title.x.angle}{angle of text for the x-axis. Default 45}
  \item{axis.title.x.just}{text justification of x-axis title. Default c("center", "top")}
  \item{axis.title.x.hjust}{adjustment for x-axis title location}
  \item{axis.title.x.vjust}{vertical adjustment of x-axis title location}
  \item{axis.title.x.margin}{use in combination with axis.title.x.vjust if text is going below the header line}
  \item{axis.title.y}{font size of y-axis text}
  \item{axis.title.y.angle}{angle of text for the y-axis. Default 90}
  \item{axis.title.y.hjust}{adjustment for x-axis title location. Default c("center", "top")}
  \item{axis.title.y.vjust}{vertical adjustment for x-axis title location}
  \item{colors}{list of colors to apply to each xdata column. Can be built by palyoplot_getColorGroups}
  \item{color.default}{default color to apply to each xdata column. Default 'grey60'}
  \item{line.e10x}{color for 10x exaggeration. To turn off, set NULL}
  \item{clust}{data for clustering (UNDER DEVELOPMENT)}
}
\value{returns ggplot object}
\author{Anna Klimaszewski-Patterson}
\seealso{
  \code{\link{palyoplot_get2ndAxis}}
}
\examples{
## EXAMPLE 1: Basic using package data
g = palyoplot_plotTaxa(x=pp_xdata, y=pp_ydata, y.label="cal yr BP", x.label="Percentages")

## EXAMPLE 2: Advanced using generic data
maxAge = 100; #max age to plot
minAge = -60; #min age to plot
Ages = data.frame(depth=c(0,20,40,60), age=c(-60,-10,40,100))

colors = c('blue', 'lightblue', 'green', 'lightgreen')
groups = data.frame(longname=c('Tree', 'Shrub'), count=c(3, 1))
fontStyles = c('plain', 'plain', 'plain', 'italic')

xdata = data.frame(Abies=c(50,12,24,32),
                   Pinus=c(54,20,44,19),
                   Quercus=c(12,50,20,11),
                   Roseaceae=c(4,9,12,2))

#create secondary y-axis information (2 y-axes)
y2 = palyoplot_get2ndAxis(interval=10, bot=maxAge, ages=Ages,
                          ages.col.secondary=1, ages.col.age=2, agemodel=FALSE)

#add zonation breaks
geom_zones = data.frame(c(maxAge, 50, 10),                #where along the y-axis
                        c("blank", "dotted", "dashed"),   #line style
                        c("grey70", "grey70", "black"),   #line color
                        c("1A", "1B", "2"),               #zone name
                        c("grey50", "grey50", "grey50"),  #font color for zone name
                        c(75, 30, -25),                   #zone name placement along y-axis
                        c(10, 10, 10))                    #x-axis offset (alignment)
colnames(geom_zones) = c("axisVal", "ltype", "lcolor", "annoText", "annoColor",
                         "annoAxis", "axisOffset")

#plot and return ggplot2 object
g = palyoplot_plotTaxa(x=xdata, y=Ages[,2], y.label="cal yr BP",
                       ylim=c(maxAge, minAge), y.break=50,
                       x.tickwidth=.6, colors=colors, plot.font.styles=fontStyles,
                       y2=y2, y2.label="depth (cm)",
                       taxaGroups=groups, zones=geom_zones,
                       x.label="Percentages", x.label.height=.4)

}
