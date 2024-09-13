# library("tidyr")
# library("data.table")
# library("ggplot")
# library("grid")
# library("gridExtra")
# library("gtable")
# library("tidyr")
# library("scales")

### palyoplot_plotTaxa() ######
palyoplot_plotTaxa = function(
  x,                   # only the data (in columns) to plot
  y,                   # first column in ydata is the main y-axis
  y.label,             # label on y-axis
  ylim = NULL,        # limits on y-axis (ex: c(2000, 0))
  y.show = TRUE,       # set to FALSE if you don't want the y-axis visible (ex: when appending graphs together)
  y.break = NULL,      # y tick breaks per how many years (ex: 100)
  y2 = NULL,           # secondary axis information. Built by palyoplot_get2ndAxis()
  y2.label = NULL,
  x.break = 10,        # x-tick interval
  x.reverse = FALSE,
  x.label = NULL,
  x.label.height = .5,#in cm
  x.label.text.gpar = gpar(fontsize = 10),
  x.label.pos = 'bottom', #NOT YET IMPLEMENTED
  x.tickwidth = 1,      # how wide is each tick. Default = 1cm
  zones = NULL,       # lines for pollen zonation, if known
  zones.anno.width = .75,    #in cm annotation widths
  taxaGroups = NULL,  # data.frame of taxa lifeforms by name and count of columns (name, count)
  taxaGroups.height = .75, #in cm
  taxaGroups.text.gpar = gpar(fontsize = 8),
  display.height = NULL,      #use unit()
  display.width = NULL,       #use unit()
  plot.style = 'area', #point, line, area, bar ###HERE -- do area logic, that's what line really is, then make line a line
  plot.style.bar.width = 5, #for use with 'bar'
  plot.style.point.color = NULL, #for use with 'point'
  plot.color.fill = TRUE,
  plot.font.styles = NULL, #list
  plot.font.style = 'plain', #default value
  plot.height = 10,    # in cm
  plot.spacer = .25,        # space between plots (in cm)
  plot.vspacer = .25,
  top.label.height = 2.25, # in cm
#  title = NULL,
#  title.gpar = gpar(fontsize = 12),
#  title.just = c("center", "bottom"),
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
  colors = NULL,       # color for index line
  color.default = 'grey60',
#  line.color = 'black', #alias for color
#  line.lwd = 1,
#  line.linetype = 'solid',
  line.e10x = 'cornsilk3',  # color for 10x exaggeration. To turn off, NA
  clust = NULL
){
  xdata = x #make it easier to keep track of variables internally
  ydata = y #make it easier to keep track of variables internally

  data = data.frame(ydata, xdata);
  data_10x = data.frame(ydata, xdata*10);
  if( is.numeric(ydata)){ #single list, not multi column
    colnames(data[1]) = 'ydata'
  }

  if( is.null(ylim)){ #if no y-axis limits, get the value extent from ydata
    ylim = c(ydata[1,1], ydata[nrow(ydata),1])
  }

  if( ylim[1] > ylim[2]){ #is the value at the top of the y-axis larger or smaller
    yREV = TRUE
  } else {
    yREV = FALSE
  }

  #the top and bottom values need to be filled with dummy x data to plot the fill polygon
  fillData = rbind(c(0), data, c(0))  #create dummy data
  fillData[1,1] = fillData[2,1]       #fill y (ex: age) with duplicate value for drawing top and bottom of polygon
  fillData[length(fillData[,1]),1] = fillData[length(fillData[,1])-1,1]

  #create list of colors for each plot if one is not passed in
  if( is.null(colors)){
    colors   = c(1:ncol(xdata))
    colors[] = color.default
  }
  if( is.null(plot.font.styles)){
    fontstyles   = c(1:ncol(xdata))
    fontstyles[] = plot.font.style
  }
  pointColors = colors
  if( !is.null(plot.style.point.color)){
    pointColors   = c(1:ncol(xdata))
    pointColors[] = plot.style.point.color
  }

  # create blank table to hold all the plots
  g = gtable(unit(.02, "cm"), unit(c(top.label.height,plot.height), "cm"))
  p2 = NULL
  p1 = NULL
  pBlank = NULL

  yname = colnames(data[1])
  if( is.numeric(ydata)){ #single list, not multi column
    ywidth=2 #offset to next column
  } else {
    ywidth = length(ydata)+1
  }

  #if taxaGroups exists and there are taxa with cumulative counts of 0
  #build cumulative counts of taxa groups to be able to reduce group counts
  origTaxaGroups = taxaGroups
  cumTaxaGroups = NULL
  if( !(is.null(taxaGroups))){
    cumTaxaGroups = taxaGroups
    for( i in 2:nrow(taxaGroups)){
      cumTaxaGroups[i, 'count'] = sum(cumTaxaGroups[(i-1):i, 'count'])
    }
  }

  for( i in ywidth:length(data)){
    name = colnames(data[i]);
    xLimit = ceiling(max(data[name])/x.break) * x.break;
    if( xLimit == 0){ #don't plot 0 value taxa
      if( !is.null(cumTaxaGroups)){ #adjust taxaGroup counts to remove 0s taxa
        omitCount = (i - ywidth)+1 #need to adjust the counts in taxaGroups
        cRow = (min(which(cumTaxaGroups[,'count'] >= omitCount))) #find row to reduce count
        taxaGroups[cRow, 'count'] = taxaGroups[cRow, 'count'] - 1 #reduce count for that row
      }
      next;
    }

    n = round(((max(ylim) - min(ylim))/y.break), 0)
    if(length(n) == 0){ n=2 } #set min number for breaks_pretty()

    p = ggplot( data=data, aes_string(x=name, y=yname))
    p = p + theme( axis.text = element_text(size=axis.text.size),
                   axis.title = element_text(size=axis.title.size),
                   axis.title.x = element_text(face=plot.font.styles[(i-ywidth+1)], angle=axis.title.x.angle, hjust=axis.title.x.hjust, vjust=axis.title.x.vjust, margin=margin(0,0,axis.title.x.margin,0)),
                   axis.title.y = element_text(size = axis.title.y, angle=axis.title.y.angle, hjust=axis.title.y.hjust, vjust=axis.title.y.vjust),
                   axis.line = element_line(colour = "black", size = .5),
                   plot.background = element_rect(fill = "white",colour = NA),
                   panel.background = element_blank(),
                   panel.grid.major = element_blank(),
                   panel.grid.minor = element_blank())

    #Create spacer plot. Add zones if there. First time through only
    if( i == ywidth){
      pBlank = p
    }

    if(plot.style == 'area' || plot.style == 'point'){
      p = p +
        geom_path(color = "cornsilk4" ) +
        geom_polygon(data=fillData, fill=colors[(i-ywidth+1)])

      if( plot.style == 'point'){
        p = p + geom_point(data=fillData, colour=pointColors[(i-ywidth+1)])
      }

      if( !is.null(line.e10x)){
        p = p +
          geom_path(data=data_10x, color = line.e10x) #10x exaggeration
      }
    } else if( plot.style == 'bar'){
      p = ggplot( data=data[,c(1,i)], aes_string(y=name, x=yname))
      p = p + geom_bar(data=data, stat='identity', na.rm=TRUE, width=plot.style.bar.width, fill=colors[(i-ywidth+1)], colour=colors[(i-ywidth+1)])
    } else {
      stop("plot.style value is invalid. Point, line, or bar")
    }

    #add zones
    if( !is.null(zones)){
      direct = "vert"
      if( plot.style == "bar"){
        direct = "horiz" #because of coordinate flipping
      }
      p = .palyoplot_appendZones(p, zones, direct, anno=FALSE)
      if( i == ywidth){
        pBlank = .palyoplot_appendZones(pBlank, zones, direct, anno=FALSE)
      }
    }

    if( plot.style == "bar"){
      intervals = seq(x.break, xLimit, by=x.break)
      p = p + coord_flip(ylim=c(0,xLimit), xlim=ylim, expand=FALSE) +
        scale_y_continuous(expand = c(0,0), breaks=intervals, labels=intervals)

      p1 = p #copy for 2nd axis otherwise issues with multiple x scales

      if( yREV == TRUE){
        #        if(!is.null(ybreak)){
        p = p + scale_x_continuous(name=y.label, limits=(ylim), expand = c(0,0), breaks=breaks_pretty(n=n))
        #        } else {
        #          p = p + scale_x_continuous(name=ylabel, limits=(ylim), expand = c(0,0))
        #        }
      } else {
        #        if(!is.null(ybreak)){
        p = p + scale_x_reverse(name=y.label, limits=rev(ylim), expand = c(0,0), breaks=breaks_pretty(n=n))
        #        } else {
        #          p = p + scale_x_reverse(name=ylabel, limits=rev(ylim), expand = c(0,0))
        #        }
      }

    } else {
      p = p + scale_x_continuous(expand = c(0,0), breaks=seq(x.break, xLimit, by=x.break), labels=seq(x.break, xLimit, by=x.break)) +
        coord_cartesian(xlim=c(0,xLimit), ylim=ylim)
    }

    if( i == ywidth){ #first time through
      #if 2ndary y-axis, clone plot with revised y-axis
      if( length(ydata) > 1 && !is.null(y2) ){
        if(yREV == TRUE){
          if( plot.style == "bar"){ #more than one y axis
            p2 = p1 +   scale_y_reverse(name=y2.label, limits=ylim,
                                        expand=c(0,0),
                                        breaks=round(as.numeric(y2$y2at)),
                                        labels=y2$y2labels)
            pBlank = pBlank +   scale_y_reverse(name=y2.label, limits=ylim,
                                        expand=c(0,0),
                                        breaks=round(as.numeric(y2$y2at)),
                                        labels=y2$y2labels)
          } else {
            p2 = p + scale_y_continuous(name=y2.label, limits=rev(ylim), expand = c(0,0),
                                        breaks=round(as.numeric(y2$y2at)), labels=y2$y2labels)
            pBlank = pBlank + scale_y_continuous(name=y2.label, limits=rev(ylim), expand = c(0,0),
                                        breaks=round(as.numeric(y2$y2at)), labels=y2$y2labels)
          }
        } else {
          if( plot.style == "bar"){ #more than one y axis
            p2 =  p1 + scale_x_reverse(name=y2.label, limits=rev(ylim), expand = c(0,0),
                                       breaks=round(as.numeric(y2$y2at)), labels=y2$y2labels)
            pBlank =  pBlank + scale_x_reverse(name=y2.label, limits=rev(ylim), expand = c(0,0),
                                       breaks=round(as.numeric(y2$y2at)), labels=y2$y2labels)
          } else {
            p2 = p +   scale_y_reverse(name=y2.label, limits=rev(ylim),
                                       expand=c(0,0),
                                       breaks=(round(as.numeric(y2$y2at))),
                                       labels=y2$y2labels)
            pBlank = pBlank +   scale_y_reverse(name=y2.label, limits=rev(ylim),
                                       expand=c(0,0),
                                       breaks=(round(as.numeric(y2$y2at))),
                                       labels=y2$y2labels)
          }
        }
      }
    }
    #attach main access to plot
    ###HERE what's the diff???
    if( plot.style != "bar"){
      #      if(!is.null(ybreak)){
      if( yREV == TRUE){
        p = p +
          scale_y_continuous(name=y.label, limits=rev(ylim), expand = c(0,0), breaks=breaks_pretty(n=n))
      } else {
        p = p +
          scale_y_reverse(name=y.label, limits=rev(ylim), expand = c(0,0), breaks=breaks_pretty(n=n))
      }
      #      } else {
      #        if( yREV == TRUE){
      #          p = p +
      #            scale_y_continuous(name=ylabel, limits=rev(ylim), expand = c(0,0))
      #        } else {
      #          p = p +
      #            scale_y_reverse(name=ylabel, limits=rev(ylim), expand = c(0,0))
      #        }
      #      }
    }

    g1 = ggplot_gtable(ggplot_build(p))
    pp = c(subset(g1$layout, name=="panel", se=t:r))

    #get the bottom axis info
    ia = which(g1$layout$name == "axis-b")
    ga = g1$grobs[[ia]]
    ax = ga$children[[2]]

    #first loop through
    if( i == ywidth){
      #create the bottom row to hold the x-axis
      g = gtable_add_rows(g, g1$heights[g1$layout[ia, ]$l])

      #create the left column to hold the y-axis
      if( y.show){
        g = .palyoplot_do_yaxis(g, g1)
        #spacer
        g = gtable_add_cols(g, unit(plot.spacer,"cm"))

        #attach 2ndary y-axis
        if( !is.null(p2)){
          #spacer between plots
          g = gtable_add_cols(g, unit(plot.spacer,"cm"), pos=0)

          g2 = ggplot_gtable(ggplot_build(p2))
          g = .palyoplot_do_yaxis(g, g2)
        }
      }
    }

    #graph left border
    rect = linesGrob(gp=gpar(col="black", lwd=2))
    g <- gtable_add_cols(g, unit(.03, c("cm")))
    g <- gtable_add_grob(g, rect, l=-1, t=2)

    #graph data
    g = gtable_add_cols(g, unit(((xLimit/x.break * x.tickwidth)),"cm"))
    g = gtable_add_grob(g, g1$grobs[[which(g1$layout$name=="panel")]], l=-1, t=2)

    #graph bottom border
    g <- gtable_add_rows(g, unit(.03, c("cm")))
    g <- gtable_add_grob(g, rect, l=-1, t=3)
    g = gtable_add_grob(g, ga, l=-1, t=4)


    #reposition x-axis label to top
    xia = which(g1$layout$name == "xlab-b")
    if(!is.null(xia)){
      xga = g1$grobs[[xia]]
      g = gtable_add_grob(g, xga, t=1, l=-1, clip="inherit")
    }

    #spacer between plots
    g1 = ggplot_gtable(ggplot_build(pBlank)) #include zones if they're there
    g = gtable_add_cols(g, unit(plot.spacer,"cm"))
    g = gtable_add_grob(g, g1$grobs[[which(g1$layout$name=="panel")]], l=-1, t=2)
  }

  #if there are taxa groups, add them to the top of the table
  layoutPos = 3
  if( !is.null(taxaGroups)){
    #    addPlotTaxaGroups(g, taxaGroups)
    gt = g
    tmp = gt[layoutPos]$layout
    gt = gtable_add_rows(gt, unit(plot.vspacer, "cm"), pos=0)
    gt = gtable_add_rows(gt, unit(.015, "cm"), pos=0)
    gt = gtable_add_rows(gt, unit(taxaGroups.height, "cm"), pos=0) #group headings
    x = 1

    for( z in 1:length(taxaGroups[,1])){
      y = taxaGroups$count[z] #get how many columns in the group
      if( is.na(y) || y < 1) next;

      rect = rectGrob(gp=gpar(fill="black", colour="black")) #dividing line
      txt  = textGrob(taxaGroups$longname[z], just="centre", hjust=NULL, gp = taxaGroups.text.gpar) #group label
      gt <- gtable_add_grob(gt, txt, l=tmp$l[x], t=1, r=tmp$l[x+y-1])  #append to colspan
      gt <- gtable_add_grob(gt, rect, l=tmp$l[x], t=2, r=tmp$l[x+y-1]) #append to colspan
      x = x+y #skip over the correct number of columns
    }
    g = gt
    layoutPos=6
  }

  if(!is.null(x.label)){
    gt = g
    tmp = gt[layoutPos]$layout
    y = max(tmp$r) #get how many columns in all the groups

    gt = gtable_add_rows(gt, unit(plot.vspacer, "cm"))
    gt = gtable_add_rows(gt, unit(x.label.height, "cm")) #bottom label
    txt  = textGrob(x.label, just="centre", hjust=NULL, gp = taxaGroups.text.gpar) #group label
    gt <- gtable_add_grob(gt, txt, l=tmp$l[1], t=-1, r=tmp$l[which(tmp$l == y)]) #append to colspan
    g = gt
  }


  if( !is.null(clust)){
    g <- gtable_add_cols(g, unit(1, c("cm")))
    g <- gtable_add_grob(g, clust, l=-1, t=3)
  }

  #if zones, and there are annotations, append the annotations to the end of the graph
  if( !is.null(zones) && "annoText" %in% colnames(zones)){
    t=2
    if( !is.null(taxaGroups)){
      t = t+3
    }
    p1 = p + geom_path(data=data_10x, colour = "white", size=2) +
      geom_path(colour="white", size=2) +
      geom_polygon(data=fillData, fill="white")

    p1 = .palyoplot_appendZones(p1, zones, direct, anno=TRUE)

    g1 = ggplot_gtable(ggplot_build(p1))
    g = gtable_add_cols(g, unit(zones.anno.width,"cm"))
    g = gtable_add_grob(g, g1$grobs[[which(g1$layout$name=="panel")]], l=-1, t=t)

  }

  if( !is.null(display.height) &&  !is.null(display.width)){
    g = palyoplot_setPanelSize(g=g, width=display.width, height=display.height)
  } else if( !is.null(display.width)){
    g = palyoplot_setPanelSize(g=g ,margin= unit(1, "mm"), width=display.width)
  } else if( !is.null(display.height)){
    g = palyoplot_setPanelSize(g=g ,margin= unit(1, "mm"), height=display.height)
  }

  grid.newpage() #clear the plot screen
  grid.draw(g) #draw the plot
  return(g)
}#palyoplot_plotTaxa()
###

### palyoplot_plotStackedTaxa() ######
palyoplot_plotStackedTaxa = function(
  x,                   # only the data (in columns) to plot
  y,                   # first column in ydata is the main y-axis
  y.label,             # label on y-axis
  ylim = NULL,        # limits on y-axis (ex: c(2000, 0))
  y.show = TRUE,       # set to FALSE if you don't want the y-axis visible (ex: when appending graphs together)
  y.break = NULL,      # y tick breaks per how many years (ex: 100)
  y2 = NULL,           # secondary axis information. Built by palyoplot_get2ndAxis()
  y2.label = NULL,
  xlim=NULL,          # limits on x-axis (ex: c(-1,1))
  x.break = 10,        # x-tick interval
  x.reverse = FALSE,
  x.label = NULL,
  x.label.height = .5,#in cm
  x.label.text.gpar = gpar(fontsize = 10),
  x.label.pos = 'bottom', #NOT YET IMPLEMENTED
  x.tickwidth = 1,      # how wide is each tick. Default = 1cm
  zones = NULL,       # lines for pollen zonation, if known
  zones.anno.width = .75,    #in cm annotation widths
  display.height = NULL,      #use unit()
  display.width = NULL,       #use unit()
  plot.style = 'area', #area, line, bar
  plot.style.bar.width = 5, #for use with 'bar'
  plot.font.style = 'plain', #default value
  plot.height = 10,    # in cm
  plot.spacer = .25,        # space between plots (in cm)
  plot.vspacer = .25,
  top.label.height = 2.25, # in cm
  title = NULL,
  title.gpar = gpar(fontsize = 12),
  title.just = c("center", "bottom"),
  axis.text.size = 8,
  axis.title.size = 12,
  axis.title.x.font.style = 'plain',
  axis.title.x.angle = 0,
  axis.title.x.just = c("center", "top"),
  axis.title.x.hjust = 0.01,
  axis.title.x.vjust = 0.5,
  axis.title.x.margin = -35,
  axis.title.y = 8,
  axis.title.y.angle = 90,
  axis.title.y.hjust = 0.1,
  axis.title.y.vjust = 0,
  colors = NULL,       # color for index line
#  line.color = 'black', #alias for color
#  line.lwd = 1,
#  line.linetype = 'solid',
  clust = NULL
){
  xdata = x #make it easier to keep track of variables internally
  ydata = y #make it easier to keep track of variables internally

  xdata = rev(xdata)  #reverse order so that the first item is on the bottom/left for plotting
  colors = rev(colors)   #reverse order so that the first item is on the bottom/left
  data = data.frame(ydata, xdata);
  if( is.numeric(ydata)){ #single list, not multi column
    colnames(data[1]) = 'ydata'
  }

  if( is.null(ylim)){ #if no y-axis limits, get the value extent from ydata
    ylim = c(ydata[1,1], ydata[nrow(ydata),1])
  }

  if( ylim[1] > ylim[2]){ #is the value at the top of the y-axis larger or smaller
    yREV = FALSE
  } else {
    yREV = TRUE
  }

  #data manipulation
  fillData = data
  #mxData = melt(xdata) #from reshape2
  mxData = gather(xdata) #using tidyr
  plotXnames = mxData[1]
  plotXvalues = mxData[2]
  if( typeof(ydata) != 'list'){
#    myData = melt(rep(ydata, times=ncol(xdata)))
    myData = gather(rep(ydata, times=ncol(xdata)))
  } else {
#    myData = melt(rep(ydata[1], times=ncol(xdata)))
    tmp = as.data.frame(rep(ydata[1], times=ncol(xdata)))
    myData = gather(tmp)
  }
#  plotYdata = myData[,1]
  plotYdata = myData[,'value']
  dfData = data.frame(plotXnames, plotXvalues, plotYdata)
  colnames(dfData) = c("taxa", "val", "age")

  #create list of colors for plot if one is not passed in
  useDefaultColors = TRUE
  if( !is.null(colors)){
    useDefaultColors = FALSE
  }

  p2 = NULL
  p1 = NULL

  xLimit = ceiling(max(rowSums(xdata))/x.break) * x.break;
  n = round(((max(ylim) - min(ylim))/y.break), 0)
  if(length(n) == 0){ n=2 } #set min number for breaks_pretty()

  if( !useDefaultColors){
    p = ggplot( data=dfData, aes_string(x="age", y="val"), colour=colors)
  } else {
    p = ggplot( data=dfData, aes_string(x=dfData[,3], y=dfData[,2]))
  }

  p = p + theme( axis.text = element_text(size=axis.text.size),
                 axis.title = element_text(size=axis.title.size),
                 axis.title.x = element_text(angle=axis.title.x.angle, hjust=axis.title.x.hjust, vjust=axis.title.x.vjust, margin=margin(0,0,axis.title.x.margin,0)),
                 axis.title.y = element_text(size = axis.title.y, angle=axis.title.y.angle, hjust=axis.title.y.hjust, vjust=axis.title.y.vjust),
                 axis.line = element_line(colour = "black", size = .5),
                 plot.background = element_rect(fill = "white",colour = NA),
                 panel.background = element_blank(),
                 panel.grid.major = element_blank(),
                 panel.grid.minor = element_blank())
  p = p + ggtitle(title) + ylab(x.label) + xlab(y.label) #assign the axis labels. Looks wrong because we have to plot x on the y and y on the x for geom_area(), then flip the axes above

  if(plot.style == 'area'){
    p = p + geom_area(aes(fill=taxa), position='stack')
  } else if(plot.style == 'line'){
    p = p + geom_line(aes(group=taxa, colour=taxa), position='stack')
  } else if( plot.style == 'bar'){
    p = p + geom_bar(aes(y=val, x=age, fill=taxa),data=dfData, stat="identity", width=plot.style.bar.width)
  } else {
    stop("plot.style value is invalid. Use area, line, or bar")
  }

  #add on zonation if any
  if( !is.null(zones)){
    direct = "vert" #axis flipping
#    if( plot.style == "bar"){
#      direct = "vert"
#    }
    p = .palyoplot_appendZones(p, zones, direct, anno=FALSE)
  }

  p1 = p #copy for 2nd axis otherwise issues with multiple x scales

  #setup basic plot info
  intervals = seq(x.break, xLimit, by=x.break)
  p = p + coord_flip(ylim=c(0,xLimit), xlim=ylim, expand=FALSE) + #need to flip coords to get age/depth on side
    scale_y_continuous(expand = c(0,0), breaks=intervals, labels=intervals)

  #if there's a second axis, clone from above, setup new info
  if( length(ydata) > 1 && !is.null(y2)){
    p2 = p1 +
      xlab(y2.label) +
      scale_x_continuous(expand = c(0,0), breaks=round(as.numeric(y2$y2at)), labels=y2$y2labels) +
      coord_flip(ylim=c(0,xLimit), xlim=ylim, expand=FALSE)
  }

  #if the y-axis needs to be reversed (by default plot wants smaller numbers at bottom, but with age not always the case)
  if( yREV == TRUE){
    #    if(!is.null(ybreak)){
    p = p + scale_x_reverse(name=y.label, limits=rev(ylim), expand = c(0,0), breaks=breaks_pretty(n=n))
    #    } else {
    #      p = p + scale_x_reverse(name=ylabel, limits=rev(ylim), expand = c(0,0))
    #    }
    if( length(ydata) > 1 && !is.null(y2) ){
      p2 = p2 + scale_y_reverse(name=y2.label, limits=rev(ylim), expand = c(0,0), breaks=round(as.numeric(y2$y2at)), labels=y2$y2labels)
    }
  } else {
    #    if(!is.null(ybreak)){
    p = p + scale_x_continuous(name=y.label, limits=rev(ylim), expand = c(0,0), breaks=breaks_pretty(n=n))
    #    } else {
    #      p = p + scale_x_continuous(name=ylabel, limits=rev(ylim), expand = c(0,0))
    #    }
    if( length(ydata) > 1 && !is.null(y2) ){
      p2 = p2 + scale_y_continuous(name=y2.label, limits=rev(ylim), expand = c(0,0), breaks=round(as.numeric(y2$y2at)), labels=y2$y2labels)
    }
  }

  pColor = p #needed to create a "blank" plot to put in zone annotations. Have to override color attributes later
  if( !useDefaultColors){
    pColor =  p + scale_fill_manual(values=colors)
    if( plot.style == "line"){
      pColor = p + scale_color_manual(values=colors)
    }
  }

  ### COPY PLOT TO NEW GTABLE ### -- cleans up table presentation
  # create blank table to hold all the plots
  g = gtable(unit(.02, "cm"), unit(c(top.label.height,plot.height), "cm"))
  g1 = ggplot_gtable(ggplot_build(pColor))
  pp = c(subset(g1$layout, name=="panel", se=t:r))

  #copy left axis to new table
  if(y.show){
    g = .palyoplot_do_yaxis(g, g1)
    #spacer
    g = gtable_add_cols(g, unit(plot.spacer,"cm"), pos=-1)
  }

  #graph left border line
  rect = linesGrob(gp=gpar(col="black", lwd=2))
  g <- gtable_add_cols(g, unit(.03, c("cm")))
  g <- gtable_add_grob(g, rect, l=-1, t=2)

  #copy graph content to new table
  g = gtable_add_cols(g, unit(((xLimit/x.break * x.tickwidth)),"cm"))
  g = gtable_add_grob(g, g1$grobs[[which(g1$layout$name=="panel")]], l=-1, t=2)

  #add title
  if(!is.null(title)){
    txt  = textGrob(title, just=axis.title.x.just, rot=axis.title.x.angle, gp = title.gpar) #group label
    g = gtable_add_grob(g, txt, l=-1, t=1)
  }

  # #graph bottom border line
  g <- gtable_add_rows(g, unit(.03, c("cm")))
  g <- gtable_add_grob(g, rect, l=-1, t=3)

  #copy the bottom axis info
  ia = which(g1$layout$name == "axis-b")
  ga = g1$grobs[[ia]]
  ax = ga$children[[2]]
  g = gtable_add_rows(g, g1$heights[g1$layout[ia, ]$t])
  g = gtable_add_grob(g, ga, l=-1, t=4)

  #copy the bottom label
  g = gtable_add_rows(g, unit(plot.vspacer, "cm"))
  g = gtable_add_rows(g, unit(x.label.height, "cm")) #bottom label
  txt  = textGrob(x.label, hjust=axis.title.x.hjust, vjust=axis.title.x.vjust, gp =x.label.text.gpar) #group label
  g = gtable_add_grob(g, txt, l=-1, t=6)

  #attach 2ndary y-axis
  if( !is.null(p2) && y.show){ ###HERE - check this later
    #spacer between plots
    g = gtable_add_cols(g, unit(plot.spacer,"cm"), pos=0)

    g2 = ggplot_gtable(ggplot_build(p2))
    g = .palyoplot_do_yaxis(g, g2)
  }


  if( !is.null(clust)){
    g <- gtable_add_cols(g, unit(1, c("cm")))
    g <- gtable_add_grob(g, clust, l=-1, t=3)
  }

  #if zones, and there are annotations, append the annotations to the end of the graph
  if( !is.null(zones) && "annoText" %in% colnames(zones)){
    t=2
    # if( !is.null(taxaGroups)){
    #   t = t+3
    # }
    white = rep("white", length(xdata))
    p1 = p + geom_path(data=dfData, colour = "white", size=2) +
      geom_path(colour="white", size=2) +
      geom_polygon(data=dfData, fill="white")
    if( plot.style == "line"){
      p1 = p1 + scale_color_manual(values=white)
    } else {
      p1 = p1 + scale_fill_manual(values=white)
    }

    p1 = .palyoplot_appendZones(p1, zones, "vert", anno=TRUE)

    g1 = ggplot_gtable(ggplot_build(p1))
    g = gtable_add_cols(g, unit(zones.anno.width,"cm"))
    g = gtable_add_grob(g, g1$grobs[[which(g1$layout$name=="panel")]], l=-1, t=t)

  }

  if( !is.null(display.height) &&  !is.null(display.width)){
    g = palyoplot_setPanelSize(g=g, width=display.width, height=display.height)
  } else if( !is.null(display.width)){
    g = palyoplot_setPanelSize(g=g ,margin= unit(1, "mm"), width=display.width)
  } else if( !is.null(display.height)){
    g = palyoplot_setPanelSize(g=g ,margin= unit(1, "mm"), height=display.height)
  }

  grid.newpage() #clear screen
  grid.draw(g)
  return(g)
}#palyoplot_plotStackedTaxa()
###----

### palyoplot_plotIndex() ######
palyoplot_plotIndex = function(
  x,                   # only the data (in columns) to plot
  y,                   # first column in ydata is the main y-axis
  y.label='',             # label on y-axis
  ylim = NULL,        # limits on y-axis (ex: c(2000, 0))
  y.show = TRUE,       # set to FALSE if you don't want the y-axis visible (ex: when appending graphs together)
  y.break = NULL,      # y tick breaks per how many years (ex: 100)
  y2 = NULL,           # secondary axis information. Built by palyoplot_get2ndAxis()
  y2.label = NULL,
  xlim=NULL,          # limits on x-axis (ex: c(-1,1))
  x.break = .2,        # x-tick interval
  x.reverse = FALSE,
  x.label = NULL,
  x.label.height = .5,#in cm
  x.label.text.gpar = gpar(fontsize = 10),
  x.label.pos = 'bottom', #NOT YET IMPLEMENTED
  x.tickwidth = 1,      # how wide is each tick. Default = 1cm
  zones = NULL,       # lines for pollen zonation, if known
  zones.anno.width = 1,    #in cm annotation widths
  display.height = NULL,      #use unit()
  display.width = NULL,       #use unit()
  color = 'black',       # alias for plot.style.color to support older versions
  plot.style = 'line', #line or bar
  plot.style.color = 'black', #color of line, bar or area
  plot.style.bar.size = 5,
  plot.line.lwd = 1,
  plot.line.linetype = 'solid',
  plot.font.style = 'plain',
  plot.height = 10,    # in cm
  plot.spacer = .25,        # space between plots (in cm)
  plot.vspacer = .25,
  top.label.height = 2.25, # in cm
  title = NULL,
  title.gpar = gpar(fontsize = 12),
  title.just = c("center", "bottom"),
  axis.text.size = 8,
  axis.title.size = 12,
  axis.title.x.font.style = 'plain',
  axis.title.x.angle = 0,
  axis.title.x.just = c("center", "top"),
  axis.title.x.hjust = 0.01,
  axis.title.x.vjust = 0.5,
  axis.title.x.margin = -35,
  axis.title.y = 8,
  axis.title.y.angle = 90,
  axis.title.y.hjust = 0.1,
  axis.title.y.vjust = 0,
  zeroline=TRUE,
  zeroline.color="black",
  zeroline.linetype="dashed",
  bg.neg.fill = NULL,
  bg.neg.alpha = .5,
  bg.pos.fill = NULL,
  bg.pos.alpha = .5,
  returnSepPlots = FALSE
){
  xdata = x #make it easier to keep track of variables internally
  ydata = y #make it easier to keep track of variables internally
  data = data.frame(ydata, xdata);
  if( typeof(ydata) != 'list'){
    offsetCol=2
  } else {
    offsetCol=ncol(ydata)+1
  }

  if(is.null(xlim)){
    x1 = floor(round(min(xdata), digits=2) * 10)/10
    if( x1 > min(xdata)){ x1 = x1 - .05} #if it's still smaller, give it a little buffer space
    x2 = ceiling(round(max(xdata), digits=2) * 10)/10
    if( x1 < max(xdata)){ x2 = x2 + .05} #if it's still smaller, give it a little buffer space
    xlim = c(x1,x2)
  }

  if( is.numeric(ydata)){ #single list, not multi column
    colnames(data[1]) = 'ydata'
  }

  if( is.null(ylim)){ #if no y-axis limits, get the value extent from ydata
    ylim = c(ydata[1,1], ydata[nrow(ydata),1])
  }
  n  = round(((max(ylim) - min(ylim))/y.break), 0)
  if(length(n) == 0){ n=2 } #set min number for breaks_pretty()

  if( ylim[1] > ylim[2]){ #is the value at the top of the y-axis larger or smaller
    yREV = FALSE
  } else {
    yREV = TRUE
  }

  #color is an alias for line.color. If it's set and line.color isn't, update line.color
  if(color != 'black' && plot.style.color == 'black'){
    plot.style.color=color
  }

  #create basic plot
  p = ggplot(data=data, aes_string(y=as.numeric(data[,offsetCol]), x=as.numeric(data[,1])))
  p = p + theme( axis.line = element_line(colour = "black", size = .5),
                 plot.background = element_rect(fill = "white",colour = NA),
                 panel.background = element_blank(),
                 panel.grid.major = element_blank(),
                 panel.grid.minor = element_blank())
  p = p + ggtitle(title) + ylab(x.label) + xlab(y.label) #assign the axis labels. Looks wrong because we have to plot x on the y and y on the x for geom_area(), then flip the axes above
  pBlank = p
  #colored bgs first because drawing order matters
  if(!is.null(bg.neg.fill)){ #negative values background
    p = p + geom_rect(aes(ymin = -1, ymax = 0, xmin = -Inf, xmax = Inf),
                      fill=bg.neg.fill, alpha=bg.neg.alpha)
  }
  if(!is.null(bg.pos.fill)){ #positive
    p = p + geom_rect(aes(ymin = 0, ymax = 1, xmin = -Inf, xmax = Inf),
                      fill=bg.pos.fill, alpha=bg.pos.alpha)
  }
  if( zeroline){ #even though it will be flipped, still references original x,y positions
    p = p + geom_hline(yintercept=0, linetype=zeroline.linetype, color=zeroline.color) #vertical line
  }

  if( plot.style == 'line'){
    p = p + geom_line(color=plot.style.color, lwd=plot.line.lwd, linetype=plot.line.linetype)
  }else if( plot.style == 'bar'){
    p = p + geom_bar(colour=plot.style.color, stat='identity', na.rm=TRUE, width=plot.style.bar.size, fill=plot.style.color)
#  }else if(plot.style == 'area'){
#    p = p + geom_ribbon(colour=plot.style.color, fill=plot.style.color)
  } else {
    print("area is not a valid type of plot style")
  }

  p1 = p #copy for 2nd axis otherwise issues with multiple x scales
  p2 = NULL

  #setup basic plot info
  i1= rev(seq(0, xlim[1], by=-x.break)) #negative side of graph starting at 0
  i2 = seq(0, xlim[2], by=x.break) #positive side of graph starting at 0

  intervals = append(i1, i2[2:length(i2)]) #remove the extra 0

  tmp = .palyoplot_buildCommonPlot( p,
                                    ydata,
                                    xlim,
                                    ylim,
                                    x.reverse,
                                    y.label,
                                    y2,
                                    y2.label,
                                    n,
                                    intervals,
                                    yREV
  )

  p = tmp[[1]]
  p2= tmp[[2]]

  #add on zonation if any
  if( !is.null(zones)){
    p = .palyoplot_appendZones(p, zones, "vert", anno=FALSE)
  }

  ### COPY PLOT TO NEW GTABLE ### -- cleans up table presentation
  xLimit = (abs(xlim[1]) + abs(xlim[2]))*10 #extent of x-axis to create proper spacing of tick widths
  if( !is.null(zones)){
    zones$dir = "horiz"
  }

  if( returnSepPlots == TRUE){ #return incl indiv plots not built in grid
    return(list(p,p2, pBlank))
  }

  g = .palyoplot_buildGTable(p,
                             p2,
                             pBlank,
                             data,
                             xlim,
                             x.break,
                             x.reverse,
                             x.label,
                             x.label.height,
                             x.label.text.gpar,
                             x.label.pos,
                             x.tickwidth,
                             zones,
                             zones.anno.width,
                             xLimit,
                             y.show,
                             title,
                             title.gpar,
                             title.just,
                             axis.text.size,
                             axis.title.size,
                             axis.title.x.font.style,
                             axis.title.x.angle,
                             axis.title.x.just,
                             axis.title.x.hjust,
                             axis.title.x.vjust,
                             axis.title.x.margin,
                             axis.title.y,
                             axis.title.y.angle,
                             axis.title.y.hjust,
                             axis.title.y.vjust,
                             plot.height,
                             plot.spacer,
                             plot.vspacer,
                             top.label.height,
                             display.height,
                             display.width,
                             clust=NULL)

  grid.newpage() #clear screen
  grid.draw(g)
  return(g)

}#palyoplot_plotIndex()
###-----

### palyoplot_plotOverlaidIndices() #####
palyoplot_plotOverlaidIndices = function(
    data,                #as data frame
    y.label='',          # label on y-axis
    ylim = NULL,         # limits on y-axis (ex: c(2000, 0))
    y.show = TRUE,       # set to FALSE if you don't want the y-axis visible (ex: when appending graphs together)
    y.break = NULL,      # y tick breaks per how many years (ex: 100)
    y2 = NULL,           # secondary axis information. Built by palyoplot_get2ndAxis()
    y2.label = NULL,
    xlim=NULL,          # limits on x-axis (ex: c(-1,1))
    x.break = .2,        # x-tick interval
    x.reverse = FALSE,
    x.label = NULL,
    x.label.height = .5,#in cm
    x.label.text.gpar = gpar(fontsize = 10),
    x.label.pos = 'bottom', #NOT YET IMPLEMENTED
    x.tickwidth = 1,      # how wide is each tick. Default = 1cm
    zones = NULL,       # lines for pollen zonation, if known
    zones.anno.width = 1,    #in cm annotation widths
    display.height = NULL,      #use unit()
    display.width = NULL,       #use unit()
    color = 'black',       # alias for plot.style.color to support older versions
    plot.style = 'line', #line or bar
    plot.style.color = 'black', #color of line, bar or area
    plot.style.bar.size = 5,
    plot.line.lwd = 1,
    plot.line.linetype = 'solid',
    plot.font.style = 'plain',
    plot.height = 10,    # in cm
    plot.spacer = .25,        # space between plots (in cm)
    plot.vspacer = .25,
    top.label.height = 2.25, # in cm
    title = NULL,
    title.gpar = gpar(fontsize = 12),
    title.just = c("center", "bottom"),
    axis.text.size = 8,
    axis.title.size = 12,
    axis.title.x.font.style = 'plain',
    axis.title.x.angle = 0,
    axis.title.x.just = c("center", "top"),
    axis.title.x.hjust = 0.01,
    axis.title.x.vjust = 0.5,
    axis.title.x.margin = -35,
    axis.title.y = 8,
    axis.title.y.angle = 90,
    axis.title.y.hjust = 0.1,
    axis.title.y.vjust = 0,
    zeroline=TRUE,
    zeroline.color="black",
    zeroline.linetype="dashed",
    bg.neg.fill = NULL,
    bg.neg.alpha = .5,
    bg.pos.fill = NULL,
    bg.pos.alpha = .5){

  g = NULL
  p = NULL
  for( i in 1:ncol(data$xdata)){
    print(i)
#    xdata = data$xdata[i]
#    ydata = data$ydata[i]
#    dfData = data.frame(ydata, xdata)

    style = plot.style
    if("style" %in% names(data)){
      style = data$style[i]
    }
    color = plot.style.color
    if("color" %in% names(data)){
      color = data$color[i]
    }
    bar = plot.style.bar.size
    if("barsize" %in% names(data)){
      bar = data$barsize[i]
    }
    linetype = plot.line.linetype
    if("linetype" %in% names(data)){
      linetype = data$linetype[i]
    }

    if(is.null(g)){
      xdata = data$xdata[i]
      ydata = data$ydata[i]
      dfData = data.frame(ydata, xdata)

      g = palyoplot_plotIndex(xdata, ydata, y.label, ylim, y.show, y.break,
                          y2, y2.label, xlim, x.break, x.reverse,
                          x.label, x.label.height, x.label.text.gpar, x.label.pos,
                          x.tickwidth, zones, zones.anno.width,
                          display.height, display.width, color,
                          plot.style=style, plot.style.color=color,
                          plot.style.bar.size=bar, plot.line.lwd=plot.line.lwd,
                          plot.line.linetype=linetype, plot.font.style,
                          plot.height, plot.spacer, plot.vspacer,
                          top.label.height, title, title.gpar, title.just,
                          axis.text.size, axis.title.size, axis.title.x.font.style,
                          axis.title.x.angle, axis.title.x.just, axis.title.x.hjust,
                          axis.title.x.vjust, axis.title.x.margin, axis.title.y,
                          axis.title.y.angle, axis.title.y.hjust, axis.title.y.vjust,
                          zeroline, zeroline.color, zeroline.linetype,
                          bg.neg.fill, bg.neg.alpha, bg.pos.fill, bg.pos.alpha,
                          returnSepPlots = TRUE)
      p = g[[1]]
    } else {
      if( plot.style == 'line'){
        xdata = data$xdata[i]
        ydata = data$ydata[i]
        dfData = data.frame(ydata, xdata)

        #this needs to be a function or else only the last plot keeps (overrides earlier data)
        p = .palyoplot_addGeomPathBar(p, dfData, plot.style, color=color, barsize=barsize, lwd=plot.line.lwd, linetype=linetype)
#        p = p + geom_path(data=dfData, aes(y=dfData[,2]), color=color, size=lwd, linetype=linetype)
      }else if( plot.style == 'bar'){
        p = .palyoplot_addGeomPathBar(p, dfData, plot.style, color=color, barsize=barsize, lwd=plot.line.lwd, linetype=linetype)
#        p = p + geom_bar(data=dfData, aes(y=dfData[,2]), colour=color, stat='identity', na.rm=TRUE, width=plot.style.bar.size, fill=color)
      }
    }
  }#for

  if(is.null(xlim)){
    x1 = floor(round(min(xdata), digits=2) * 10)/10
    if( x1 > min(xdata)){ x1 = x1 - .05} #if it's still smaller, give it a little buffer space
    x2 = ceiling(round(max(xdata), digits=2) * 10)/10
    if( x1 < max(xdata)){ x2 = x2 + .05} #if it's still smaller, give it a little buffer space
    xlim = c(x1,x2)
  }

  xLimit = (abs(xlim[1]) + abs(xlim[2]))*10 #extent of x-axis to create proper spacing of tick widths
  g = .palyoplot_buildGTable(p,
                             g[[2]],
                             g[[3]],
                             dfData,
                             xlim,
                             x.break,
                             x.reverse,
                             x.label,
                             x.label.height,
                             x.label.text.gpar,
                             x.label.pos,
                             x.tickwidth,
                             zones,
                             zones.anno.width,
                             xLimit,
                             y.show,
                             title,
                             title.gpar,
                             title.just,
                             axis.text.size,
                             axis.title.size,
                             axis.title.x.font.style,
                             axis.title.x.angle,
                             axis.title.x.just,
                             axis.title.x.hjust,
                             axis.title.x.vjust,
                             axis.title.x.margin,
                             axis.title.y,
                             axis.title.y.angle,
                             axis.title.y.hjust,
                             axis.title.y.vjust,
                             plot.height,
                             plot.spacer,
                             plot.vspacer,
                             top.label.height,
                             display.height,
                             display.width,
                             clust=NULL)

  grid.newpage() #clear screen
  grid.draw(g)
  return(g)

}
#palyoplot_plotOverlaidIndexes()

###---
###
# Add the path or bar. Needed because it gets overridden in a loop
###
.palyoplot_addGeomPathBar = function(p, dfData, style, color, barsize, lwd, linetype){
  if( style == "line"){
    p = p + geom_path(data=dfData, aes(y=dfData[,2]), color=color, size=lwd, linetype=linetype)
  } else if (style == "bar"){
    p = p + geom_bar(data=dfData, aes(y=dfData[,2]), colour=color, stat='identity', na.rm=TRUE, width=barsize, fill=color)

  } else {
    print("must be a line or bar. Please reconfigure")
    return()
  }
  return (p)
}#.palyoplot_addGeomPathBar

###---
###
# get and format data for plotting 2nd y-axis
###
palyoplot_get2ndAxis = function (interval, ages, agemodel=TRUE, top=NULL, bot=NULL, ages.col.secondary=1, ages.col.age=5){
  if( is.null(top)){
    top = ages[1,ages.col.age]
  }
  if( is.null(bot)){
    bot = ages[(nrow(ages)), ages.col.age]
  }
  if( agemodel != TRUE){
    ages = .palyoplot_buildAgeModel(ages, data.col.depth=ages.col.secondary, data.col.age=ages.col.age)
    ages.col.age=2
    ages.col.secondary=1
  }

  #trim to top date in case they're not starting at top of age model
  if( top > bot){
    ages   = ages[min(which(ages[,ages.col.age] >= bot)):nrow(ages),] #limit dataset to maxAge
  } else {
    ages   = ages[min(which(ages[,ages.col.age] >= top)):nrow(ages),] #limit dataset to maxAge
  }

  y2at = .palyoplot_get_y2at(top, bot, interval, ages, ages.col.age) #get years by depth
  tmp = data.frame(1:length(y2at))             #get length to create null data frame
  colnames(tmp)[1] = 'y2at'                    #rename field

#  y2length = (length(y2at)*interval)+1-interval #how many positions are there?

  tmp$y2at = y2at
  tmp$y2labels = ages[,1][which(ages[,ages.col.age] %in% y2at)]
#  tmp$y2labels = .palyoplot_get_y2labels(min, y2length, interval) #create the labels in intervals

  return(tmp)
}#palyoplot_get2ndAxis()
###

###
# create sequence of labels
###
.palyoplot_get_y2labels = function(top, bot, interval){
  return (seq(top, bot, interval));
}#.palyoplot_get_y2labels()-----


###
# create sequence of "at" (ex: age) which to plot the depth labels
# -- use in conjuction with get_y2labels
###
.palyoplot_get_y2at = function(top, bot, interval=10, ages, age.col=5){
  l = vector() #empty vector to load with data for return

  i=1
  x=1
  while( i <= nrow(ages)){
    if( top > bot){
      if( ages[i,age.col] < bot) break;
    } else {
      if( ages[i,age.col] > bot) break;
    }

    l = c(l, ages[i,age.col]);
    i = i+interval
    x = x+1
  }
  return(l)
}#.palyoplot_get_y2at()----

######
.palyoplot_appendZones = function(p, zones, direct="horiz", size=3, anno=FALSE){
  #annotations needs to happen outside of drawing the lines
  if( !("axisVal" %in% colnames(zones))){
    stop("Make sure that you pass in a column with your axis intercepts named 'axisVal'");
  }
  #set background of annotations to white in plot bg has been colored
  if( anno == TRUE && "annoText" %in% colnames(zones)){
    p = p + geom_rect(aes(ymin = -Inf, ymax = Inf, xmin = -Inf, xmax = Inf), fill="white")
  }
  for( i in 1:nrow(zones)){
    if( "ltype" %in% colnames(zones)){
      ltype = as.character(zones$ltype[i])
    } else {
      ltype = "solid"
    }
    if( anno == TRUE && "annoText" %in% colnames(zones) && !is.null(zones$annoText[i])){
      anno       = TRUE
      annoText   = as.character(zones$annoText[i])
      annoColor  = "grey50"
      annoAxis   = as.numeric(zones$axisVal[i])
      axisOffset = 0

      if( "annoColor" %in% colnames(zones) && !is.null(zones$annoColor[i])){
        annoColor = as.character(zones$annoColor[i])
      }
      if( "annoAxis" %in% colnames(zones) && !is.null(zones$annoAxis[i])){
        annoAxis = as.numeric(zones$annoAxis[i])
      }
      if( "axisOffset" %in% colnames(zones) && !is.null(zones$axisOffset[i])){
        axisOffset = as.numeric(zones$axisOffset[i])
      }
    }

    if ("lcolor" %in% colnames(zones)){
      lcolor = as.character(zones$lcolor[i])
    } else {
      lcolor = "grey70"
    }

    if( direct=="horiz"){
      p = p +
        geom_hline(yintercept=as.numeric(zones$axisVal[i]), linetype=ltype, color=lcolor)
      if( anno == TRUE){
        p = p +
          annotate(geom="text", y=annoAxis, x=axisOffset, label=annoText, color=annoColor, size=size)
      }
    } else {
      p = p +
        geom_vline(xintercept=as.numeric(zones$axisVal[i]), linetype=ltype, color=lcolor)
        if( anno == TRUE){
          p = p +
            annotate(geom="text", x=annoAxis, y=axisOffset, label=annoText, color=annoColor, size=size)
        }
    }
  }
  return(p)
}#.palyoplot_appendZones

.palyoplot_2yaxis = function(p1, p2, side="right", ylab=NULL, top.spacer=unit(2, "cm"), height=NULL, width=NULL){

  ## extract gtable
  g1 = ggplot_gtable(ggplot_build(p1))
  g2 = ggplot_gtable(ggplot_build(p2))

  ## overlap the panel of the 2nd plot on that of the 1st plot
  pp = c(subset(g1$layout, name=="panel", se=t:r))

  ## steal axis from second plot and modify
  ia = which(g2$layout$name == "axis-l")
  ga = g2$grobs[[ia]]
  ax = ga$children[[2]]

  yia = which(g2$layout$name == "ylab")
  yga = g2$grobs[[yia]]

  g = gtable_add_grob(g1, g2$grobs[[which(g2$layout$name=="panel")]], pp$t, pp$l, pp$b, pp$l)

  if( side == "left"){
    rect = linesGrob(gp=gpar(col="black", lwd=2))
    g <- gtable_add_cols(g, unit(.02, c("cm")), pos=0)
    g <- gtable_add_grob(g, rect, pp$t, 1, pp$b)

    g <- gtable_add_cols(g, g2$widths[g2$layout[ia, ]$l], pos=0)
    g <- gtable_add_grob(g, ax, pp$t, 1, pp$b)

    #label
    if(ylab=="top"){
      g <- gtable_add_rows(g, top.spacer, pos=0)       #create row to hold the vertical label
      g <- gtable_add_grob(g, yga, 1, 1, pp$b)         #add the copied grob from g2

      #move g1's label too
      yia = which(g$layout$name == "ylab")             #find the label
      yga = g$grobs[[yia]]                             #get the label's grob
      g <- gtable_add_grob(g, yga, 1, pp$l+1, pp$b)    #add label to the top
      g$grobs[[yia]] = nullGrob()                      #null out existing label
      g$widths[g$layout[yia, ]$l] = list(unit(0,"cm")) #remove space where label was
    } else {
      g <- gtable_add_cols(g, g2$widths[g2$layout[yia, ]$l], pos=0)
      g <- gtable_add_grob(g, yga, pp$t, 1, pp$b)
    }
  } else {
    ax$widths <- rev(ax$widths)
    ax$grobs <- rev(ax$grobs)
    ax$grobs[[1]]$x <- ax$grobs[[1]]$x - unit(1, "npc") + unit(0.15, "cm")
    g <- gtable_add_cols(g, g2$widths[g2$layout[ia, ]$l], length(g$widths) - 1)
    g <- gtable_add_grob(g, ax, pp$t, length(g$widths) - 1, pp$b)
  }

  # draw it
  if( !is.null(height) &&  !is.null(width)){
    g = set_panel_size(g=g, width=width, height=height)
  } else if( !is.null(width)){
    g = set_panel_size(g=g ,margin= unit(1, "mm"), width=width)
  } else if( !is.null(width)){
    g = set_panel_size(g=g ,margin= unit(1, "mm"), height=height)
  }

  grid.draw(g)
  return(g)
} #palyoplot_2yaxis

.palyoplot_do_yaxis = function(g, g1){
  yia = which(g1$layout$name == "axis-l")
  yga = g1$grobs[[yia]]
  if(!is.null(yga$children)){
    yax = yga$children[[2]]

    rect = linesGrob(gp=gpar(col="black", lwd=2))
    g = gtable_add_cols(g, unit(.02, c("cm")), pos=0)
    g = gtable_add_grob(g, rect, t=2, l=1)

    g = gtable_add_cols(g, g1$widths[g1$layout[yia, ]$l], pos=0)
    g = gtable_add_grob(g, yax, t=2, l=1)

    yia = which(g1$layout$name == "ylab-l")
    yga = g1$grobs[[yia]]
    g = gtable_add_grob(g, yga, t=1, l=1, clip="off")
  }
  return(g)
} #.palyoplot_do_axis


###
# Function: palyoplot_appendGraphs  ###-------
# Purpose: append multiple palyoplot graphs together
###
palyoplot_appendGraphs = function(arr, height=NULL, widths=NULL){
#arr = list() of gtable plots
#height = height of graph (use unit())
#widths = width of each individual graph when arranging. Use units()

  if( length(arr) <= 1){
    print("Nothing to append")
    return()
  }

  g = grid.arrange(grobs=arr, ncol=length(arr), height=height, widths=widths)

#  v =  viewport(grid.layout(1, length(arr)), width=width, height=height)

  grid.newpage() #clear screen
  grid.draw(g)
  return(g)
}#palyoplot_appendGraphs


###
# Function: palyoplot_setPanelSize  ###-------
# Purpose: gets the panel size of the graph
###
palyoplot_setPanelSize = function(p=NULL, g=ggplotGrob(p), file=NULL,
                                  margin= unit(1, "mm"),
                                  width = unit(5, "cm"),
                                  height= unit(10, "cm")){
  panels = g$layout$name == "panel"
  panel_index_w = g$layout$l[panels]
  panel_index_h = g$layout$t[panels]
  if( length(panel_index_h) == 0 || is.na(panel_index_w)){
    panel_index_w = length(g$widths)
    nw = 1
  } else {
    nw = length(unique(panel_index_w))
  }
  if( length(panel_index_h) == 0 || is.na(panel_index_h)){
    panel_index_h = 2
    nh = 1
  } else {
    nh = length(unique(panel_index_h))
  }
  g$widths[panel_index_w] = rep(width, nw)
  g$heights[panel_index_h] = rep(height, nh)

  #  class(g) = c("fixed", class(g), "ggplot")
  if( !is.null(file)){
    ggsave(file, g,
           width = convertWidth(sum(g$widths) + margin, unitTo="in", valueOnly=TRUE),
           height = convertHeight(sum(g$heights) + margin, unitTo="in", valueOnly=TRUE))
  }
  return(g)
}#palyoplot_setPanelSize


.print.fixed = function(x) grid.draw(x)
