###
# function palyoplot_assignAges ###-------
#
# Purpose: interpolate ages from age model and assign to depths
#
# Inputs
#   df:       data object (ex: Canopy)
#   agemodel:      age model object
#   col.depth: default 1   #column number of core depths in df object
###
palyoplot_assignAges = function(df, agemodel, df.col.depth=1, agemodel.col.depth=1, agemodel.col.age=5){
  data <- data.frame(0, df);  #add age column to beginning
  colnames(data)[1] = 'age'

  for(i in 1:nrow(df)){
    dDepth = df[i,df.col.depth]
    matchRows = which(agemodel[,agemodel.col.depth]>=floor(dDepth))
    arrAgeDepths = agemodel[matchRows,]
    if(arrAgeDepths[1,agemodel.col.depth]==dDepth){
      data[i,1] = arrAgeDepths[1,agemodel.col.age] #first data in truncated list of age model possibilities. Do this in case age model not in whole numbers
    } else{
      for(x in 1:nrow(arrAgeDepths)){ #find the next value in the age model that's greater than our data's depth
        aDepth = arrAgeDepths[x,agemodel.col.depth]
        if( aDepth > dDepth){
          thisAge = arrAgeDepths[x,agemodel.col.age];
          prevAge = arrAgeDepths[x-1,agemodel.col.age];

          depthFraction = (dDepth - trunc(dDepth)); #get decimal place
          data[i, 1] = round(((thisAge - prevAge) * depthFraction) + prevAge);
          break;
        }
      }
    }
  }
  names(data) = gsub("\\.+", " ", names(data)) #replace all "." with " "
  return(data)
}#palyoplot_assignAges()

###
# Function: palyoplot_getTaxaGroups ###-------
###
palyoplot_getTaxaGroups = function(lifeForms, taxaList, data, data.taxa.col.start=1, data.taxa.col.end=NULL, taxaList.field.id='taxa_id', taxaList.field.groupby='merge_under', lifeForms.field.orderby='id', taxaList.field.orderby='order', field.id='life_id', taxaList.field.return='life_name'){
  names(data) = gsub("\\.+", " ", names(data)) #replace all "." with " "
  if(is.character(taxaList)){
    taxaList     = read.csv(taxaList);
  }
  if( is.null(data.taxa.col.end)){ data.taxa.col.end = length(data)}

  lifeForms = lifeForms[order(lifeForms$id),]
  selectTaxaNames = names(data[,data.taxa.col.start:data.taxa.col.end])
  subTaxaList     = taxaList[(taxaList$taxa_name %in% selectTaxaNames),];     #subset lifeForms to the taxa used

  #reorder
  l = data.frame(life_id=character(), taxa_id=character())
  for(i in 1:nrow(lifeForms)){
    taxa_id = subTaxaList[which(subTaxaList[field.id]==as.character(lifeForms[i, field.id])),];
    if(nrow(taxa_id) > 0){ #a match exists
      taxa_id = .palyoplot_matchTaxaLifeType(taxa_id, taxaList.field.groupby, taxaList.field.id)
      l = rbind(l, taxa_id);
    }
  }

  groupCounts = aggregate(x=l[field.id], by=l[field.id], FUN=NROW) #count the number of taxa in each group
  colnames(groupCounts) = c('name', 'count')
  groupCounts = merge(groupCounts, lifeForms[c(field.id, taxaList.field.return)], by.x="name", by.y=field.id)
  colnames(groupCounts) = c('name', 'count', 'longname')
  groupCounts = groupCounts[match(lifeForms[,field.id], groupCounts$name),]; #reset back to original order

  return(na.omit(groupCounts));
}#palyoplot_getTaxaGroups()

###
# Function: palyoplot_getColorsGroups ###-------
###
palyoplot_getColorsGroups = function(colorGroups, taxaGroups=NULL, colorGroups.field.id='life_id', field.color='color', taxaList=NULL){
  if( is.character(colorGroups)){
    colorGroups = read.csv(colorGroups);
  }

  l = list()
  if( !is.null(taxaGroups)){ #groups are passed in. Align with colors and repeat color number of times items in each group
    query = taxaGroups[match(colorGroups[,colorGroups.field.id], taxaGroups$name),]; #reset back to original order
    query[field.color] = colorGroups[field.color]
    query = na.omit(query)
    for( i in 1:nrow(query)){
      colorReps = rep(as.character(query[i, field.color]), query$count[i])
      l = append(l, colorReps);
    }
    return(as.character(l));

  } else if( taxaList){
    selectTaxaNames = names(taxaList);

    #assign colors to pollen
    query = merge(taxaList, colorGroups, by="life_id") #merge in the colors
    query = query[match(selectTaxaNames, query$taxa_name),];     #subset to the taxa used

    #get pollen order
    l = .palyoplot_getTaxaOrder(colorGroups$life_id, taxaList);

    tmp = as.data.frame(match(l$taxa_id, query$taxa_id));
    tmp = tmp[unlist(lapply(tmp, function(x) !is.na(x))),];

    query = query[order(tmp),];
  }

  return(query$color);
}#palyoplot_getColorsGroups()

###
# Function: palyoplot_getFontStyles ###-------
###
palyoplot_getFontStyles = function(taxaList, data, taxaList.field.style="fontstyle", taxaList.field.text="taxa_name"){
  names(data) = gsub("\\.+", " ", names(data)) #replace all "." with " "
  query = taxaList[which( taxaList[,taxaList.field.text] %in% names(data)),];     #subset to the taxa used

  selectTaxaNames = names(data);

  #assign colors to pollen
  query = query[match(selectTaxaNames, query$taxa_name),];     #subset to the taxa used

  return(as.character(query[,taxaList.field.style]))
}#palyoplot_getFontStyles()

###
# Function: palyoplot_convertPercentages  ###-------
#
# Variables:
#   data = data.frame of taxa counts
#   per.min = minium percentage threshold to keep the taxa (default .01 aka 1%)
#   per.recalc = whether to recalculate the row's percentages after columns below thw minimum percentage threshold are dropped (default FALSE)
#   data.exclude = list of taxa which should be excluded from total sum calculations (when calculating %) (default NULL)
#   data.drop = list of taxa to be completely dropped from the data variable (default NULL)
###
palyoplot_convertPercentages = function(data, per.min=1, per.recalc=FALSE, data.exclude=NULL, data.drop=NULL){
  if( per.min > 100){
    print ("Please supply the variable per.min as a number between 0 and 100")
    return()
  }
  tData = data
  #subset the data to exclude columns user already knows they want to drop, but didn't do it before passing in their data
  if(!is.null(data.drop)){
    #Need to check with space between words AND "." as separator. Convert all . to " " for simplicity
    names(tData) = gsub("\\.+", " ", names(tData))
    data.drop = gsub("\\.+", " ", data.drop)

    whichCols = which(names(tData) %in% data.drop)
    if(length(whichCols) > 0){
      tData = tData[,-whichCols] #drop the columns
    }
  }

  tData = .palyoplot_calcPer(tData, data.exclude) #calculate %s

  tData = .palyoplot_minPercentage(tData, per.min)
  # tDropCols = NULL
  # for(col in 1:length(tData)){
  #   if( max(tData[,col]) < per.min){
  #     tDropCols = c(tDropCols, col) #track which columns do not meet the min %val
  #   }
  # }
  # if(!is.null(tDropCols)){
  #   tData = tData[-tDropCols] #drop the columns that don't meet the per.min threshold
  # }

  if( per.recalc == TRUE){
    tData = .palyoplot_calcPer(tData)
  }

  return(tData)
} #palyoplot_convertPercentages

.palyoplot_minPercentage = function(data, per.min=1){
  names(data) = gsub("\\.+", " ", names(data)) #replace all "." with " "
  tDropCols = NULL
  for(col in 1:length(data)){
    if( max(data[,col]) < per.min){
      tDropCols = c(tDropCols, col) #track which columns do not meet the min %val
    }
  }

  if(!is.null(tDropCols)){
    names(data) = gsub("\\.+", " ", names(data)) #replace all "." with " "
    return(data[-tDropCols]) #drop the columns that don't meet the per.min threshold
  } else{
    return(data)
  }
}#.palyoplot_minPercentage()

###
# Function: palyoplot_getTaxaNamesByGroup  ###-------
###
palyoplot_getTaxaNamesByGroup = function(data, taxaList, group, group.field.id='life_id', taxaList.field.id="taxa_name", convertColHeader=TRUE){
  names(data) = gsub("\\.+", " ", names(data)) #replace all "." with " "
  query = taxaList[which(taxaList[,group.field.id] %in% group),]; #select all columns where the group.field.id matches the variables passed in group

  if(convertColHeader == TRUE){
    query[,taxaList.field.id] = gsub(" ", ".", query[,taxaList.field.id])
  }
  return(as.character(query[,taxaList.field.id]))
}#palyoplot_getTaxaNamesByGroup()

###
# Function: .palyoplot_getTaxaOrder  ###-------
###
.palyoplot_getTaxaOrder = function(lifeForms, taxaList, taxaList.field.id='taxa_id', taxaList.field.groupby='merge_under', lifeForms.field.orderby='id', taxaList.field.orderby='order', field.id='life_id', taxaList.field.return='taxa_name'){
  orderBy = lifeForms[lifeForms.field.orderby];
  l = data.frame(life_id=character(), taxa_id=character())

  for(i in 1:nrow(orderBy)){
    taxa_id = taxaList[which(taxaList[field.id]==as.character(lifeForms[i, field.id])),];
    taxa_id = .palyoplot_matchTaxaLifeType(taxa_id, taxaList.field.groupby, taxaList.field.id, taxaList.field.orderby)

    l = rbind(l, taxa_id);
  }

  return(l);

}#.palyoplot_getTaxaOrder()

###
# Function: palyoplot_setTaxaOrder  ###-------
###
###### need to do logic for whether merging is true or not. Right now assumes TRUE
palyoplot_setTaxaOrder = function(lifeForms, taxaList, data, taxaList.field.id='taxa_id', data.field.name='taxa_name', taxaList.field.groupby='merge_under', lifeForms.field.orderby='id', taxaList.field.orderby='order', field.id='life_id', taxaList.field.return='taxa_name', mergeData=TRUE){
  names(data) = gsub("\\.+", " ", names(data)) #replace all "." with " "
  tOrder = .palyoplot_getTaxaOrder(lifeForms, taxaList, taxaList.field.id=taxaList.field.id, taxaList.field.groupby=taxaList.field.groupby, lifeForms.field.orderby=lifeForms.field.orderby, taxaList.field.orderby=taxaList.field.orderby, field.id=field.id, taxaList.field.return=taxaList.field.return)
  l = matrix(nrow=nrow(data)) #create blank to fill in #rows. Will need to suset the first column out when returning data

  if(mergeData == TRUE){
    data = palyoplot_mergeDataUnder(data, taxaList, taxaList.field.groupby=taxaList.field.groupby, taxaList.field.id=taxaList.field.id, data.field.name=data.field.name)
  }

  for(col in tOrder[,data.field.name]){
#    print(col)
    if( col %in% colnames(data)){
      tmp = data[col];
#      print(tmp)
      l = cbind(l, tmp);
    }
  }
  return(l[2:length(l)])



}#palyoplot_setTaxaOrder

###
# Function: palyoplot_mergeDataUnder  ###-------
###
palyoplot_mergeDataUnder = function(data, taxaList, taxaList.field.groupby='merge_under', taxaList.field.id="taxa_id", data.field.name="taxa_name"){
  groupBy = unique(taxaList[taxaList.field.groupby])                          #get the unique groupBy values (keeps only the values)
  colnames(groupBy) = "xxx"                                        #set the first field colname to tmp value to avoid error of duplicate colnames
  taxa_id = merge(groupBy, taxaList, by.x="xxx", by.y=taxaList.field.id)  #merge the datasets to create a complete list ensuring the primary merged datarecord is kept

  names(data) = gsub("\\.+", " ", names(data)) #replace all "." with " "
  names(data) = trimws(names(data)) #remove trailing/leading whitespaces from names because people

  tData = data.frame()
  useData = data.frame(matrix(NA, nrow=nrow(data)))
  for(i in 1:nrow(groupBy)){ #by row (age/depth)
    #get the sum of the row
    val = groupBy[i,]
    matchingVals = which(as.matrix(taxaList[,taxaList.field.groupby]) %in% val)
    matchingTaxa = taxaList$taxa_name[matchingVals]
    matchingTaxaData = which(names(data) %in% taxaList[matchingVals,data.field.name])
    useTaxaName = as.character(taxaList$taxa_name[which(as.matrix(taxaList[,taxaList.field.id]) %in% val)])

    useData[useTaxaName] = rowSums(data[matchingTaxaData])
  }
  return(useData[2:length(useData)])
}

###
# Function: .palyoplot_buildAgeModel  ###-------
###
.palyoplot_buildAgeModel = function(data, data.col.depth=1, data.col.age=2){
  l = data.frame()
  z = 1
  for( i in 1:nrow(data)){
    if( i == nrow(data)){
      break
    }
    ndep = abs(data[i+1,data.col.depth] - data[i,data.col.depth])
    nage = data[i,data.col.age] - data[i+1,data.col.age]
    timestep = nage/ndep
    sAge = data[i,data.col.age]

    tmpDepth= c(data[i,data.col.depth]:data[i+1,data.col.depth])
    #    if( i > 1){
    #      tmpDepth = tmpDepth[2:length(tmpDepth)]
    #    }
    tmpAge = NULL
    for( x in 1:length(tmpDepth)){
      tmpAge = c(tmpAge, sAge)
      sAge = sAge - timestep
    }
    tmp = matrix(c(as.numeric(tmpDepth), as.numeric(tmpAge)), ncol=2)
    colnames(tmp) = c('depth', 'age')
    l = rbind(l, tmp)
  }

  return(unique.data.frame(l)); #remove duplicates
}#.palyoplot_buildAgeModel()

#--- Private functions ---#
###
# Private Function: palyoplot_calcPer  ###-------
###
.palyoplot_calcPer = function(data, data.exclude=NULL){
  names(data) = gsub("\\.+", " ", names(data)) #replace all "." with " "
  tNames = names(data)
  for(i in 1:nrow(data)){ #by row (age/depth)
    #get the sum of the row
    doEx = which(names(data) %in% data.exclude)
    if(length(doEx)>0){
      sumRow = sum(data[i, -which(names(data) %in% data.exclude)])
    } else {
      sumRow = sum(data[i,])
    }

    for(col in tNames){ #by column (taxa)
      if(is.na(match(col, data.exclude))){ #only convert to % if not a column excluded from calculating %s
        data[i,col] = (data[i,col]/sumRow)*100
      }
    }
  }
  names(data) = gsub("\\.+", " ", names(data)) #replace all "." with " "
  return(data)
}#.palyoplot_calcPer()

###
# Function: .palyoplot_matchTaxaLifeType  ###-------
###
.palyoplot_matchTaxaLifeType = function(taxa_id, taxaList.field.groupby, taxaList.field.id, taxaList.field.orderby){
  #grab all the taxa that match the life_id type

  groupBy = unique(taxa_id[taxaList.field.groupby])                          #get the unique groupBy values (keeps only the values)
  colnames(groupBy) = "xxx"                                        #set the first field colname to tmp value to avoid error of duplicate colnames
  taxa_id = merge(groupBy, taxa_id, by.x="xxx", by.y=taxaList.field.id)  #merge the datasets to create a complete list ensuring the primary merged datarecord is kept
  taxa_id = taxa_id[order(taxa_id[taxaList.field.orderby]),];                #reorder results by orderBy field
  colnames(taxa_id)[1] = taxaList.field.id                               #set the first field colname back to taxaList.field.id (remove tmpVal)

  return(taxa_id)
}


###
# Function: .palyoplot_appendZones  ###-------
.palyoplot_appendZones = function(p, zones, direct="vert", size=3, anno=FALSE){
  if( is.null(zones)){ #no zones, no reason to append
    return(p)
  }

  #annotations needs to happen outside of drawing the lines
  if( !("axisVal" %in% colnames(zones))){
    stop("Make sure that you pass in a column with your axis intercepts named 'axisVal'");
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

    if( direct=="vert"){
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

###
# Function: .palyoplot_buildCommonPlot  ###-------
###
.palyoplot_buildCommonPlot = function(
  p,
  ydata,
  xlim,
  ylim,
  x.reverse=FALSE,
  y.label=NULL,
  y2=NULL,
  y2.label=NULL,
  n,
  intervals,
  yREV=FALSE
){
  p1 = p
  p2 = NULL

  if( x.reverse == TRUE){
    x.rev.ylim = c(xlim[2],xlim[1])
  } else {
    x.rev.ylim = c(xlim[1],xlim[2])
  }
  p = p1 + coord_flip(ylim=x.rev.ylim, xlim=ylim, expand=FALSE) #need to flip coords to get age/depth on side
  p = p + scale_y_continuous(expand = c(0,0), breaks=intervals, labels=intervals)

  #if there's a second axis, clone from above, setup new info
  if( length(ydata) > 1 && !is.null(y2)){
    p2 = p1 +
      xlab(y2.label) +
      scale_x_continuous(expand = c(0,0), breaks=round(as.numeric(y2$y2at)), labels=y2$y2labels) +
      coord_flip(ylim=c(xlim[1],xlim[2]), xlim=ylim, expand=FALSE)
  }

  if( yREV == TRUE){
    p = p + scale_x_reverse(name=y.label, limits=rev(ylim), expand = c(0,0), breaks=breaks_pretty(n=n))
    if( length(ydata) > 1 && !is.null(y2) ){
      p2 = p1 + scale_y_reverse(name=y2.label, limits=rev(ylim), expand = c(0,0), breaks=round(as.numeric(y2$y2at)), labels=y2$y2labels)
    }
  } else {
    p = p + scale_x_continuous(name=y.label, limits=rev(ylim), expand = c(0,0), breaks=breaks_pretty(n=n))
    if( length(ydata) > 1 && !is.null(y2) ){
      p2 = p1 + scale_y_continuous(name=y2.label, limits=ylim, expand = c(0,0), breaks=round(as.numeric(y2$y2at)), labels=y2$y2labels)
    }
  }
  return(list(p, p2))
}# .palyoplot_buildCommonPlot()
###

###
# Function: .palyoplot_buildBasicTheme  ###-------
###
.palyoplot_buildBasicTheme = function(
  p,
  axis.text.size,
  axis.title.size,
  axis.title.x.fontstyle,
  axis.title.x.angle,
  axis.title.x.just,
  axis.title.x.hjust,
  axis.title.x.vjust,
  axis.title.x.margin,
  axis.title.y,
  axis.title.y.angle,
  axis.title.y.hjust,
  axis.title.y.vjust
){
  p = p + theme( axis.text = element_text(size=axis.text.size),
                 axis.title = element_text(size=axis.title.size),
                 axis.title.x = element_text(angle=axis.title.x.angle, hjust=axis.title.x.hjust, vjust=axis.title.x.vjust, margin=margin(0,0,axis.title.x.margin,0), face=axis.title.x.fontstyle),
                 axis.title.y = element_text(size = axis.title.y, angle=axis.title.y.angle, hjust=axis.title.y.hjust, vjust=axis.title.y.vjust),
                 axis.line = element_line(colour = "black", size = .5),
                 plot.background = element_rect(fill = "white",colour = NA),
                 panel.background = element_blank(),
                 panel.grid.major = element_blank(),
                 panel.grid.minor = element_blank())
  return(p)
}# .playoplot_buildBasicTheme()
###

###
# Function: .palyoplot_buildGTable  ###-------
###
.palyoplot_buildGTable = function(
  p,
  p2,
  pBlank,
  dfData,
  xlim = NULL,
  x.break = .2,
  x.reverse = FALSE,
  x.label = '',
  x.label.height = .5, #in cm
  x.label.text.gpar = gpar(fontsize = 10),
  x.label.pos = "bottom",
  x.tickwidth = 1, # how wide is each tick. Default = 1cm
  zones = NULL,
  zones.anno.width = 1,    #in cm annotation widths,
  xLimit = NULL,
  y.show = TRUE,
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
  plot.height = 10,    # in cm
  plot.spacer = .25,        # space between plots (in cm)
  plot.vspacer = .25,
  top.label.height = 2.25, # in cm
  display.height = NULL,      #use unit()
  display.width = NULL,       #use unit()
  clust=NULL
){
  g = .palyoplot_buildBasicGTable(
    p,
    p2,
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
    axis.title.x.fontstyle,
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
    display.width
  )

  if( !is.null(clust)){
    g <- gtable_add_cols(g, unit(1, c("cm")))
    g <- gtable_add_grob(g, clust, l=-1, t=3)
  }

  #if zones, and there are annotations, append the annotations to the end of the graph
#  g = .palyoplot_appendZoneAnno(p, g, zones, zones.anno.width)

  if( !is.null(zones) && "annoText" %in% colnames(zones)){
    direct = "horiz"
    if( with(zones, exists('dir'))){
      direct = zones$dir[1]
    }

    p1 = p + geom_rect(aes(ymin = -Inf, ymax = Inf, xmin = -Inf, xmax = Inf),
                       fill="white")

    p1 = .palyoplot_appendZones(p1, zones, direct, anno=TRUE)

    g1 = ggplot_gtable(ggplot_build(p1))
    g = gtable_add_cols(g, unit(zones.anno.width,"cm"))
    g = gtable_add_grob(g, g1$grobs[[which(g1$layout$name=="panel")]], l=-1, t=2)

  }

  if( !is.null(display.height) &&  !is.null(display.width)){
    g = palyoplot_setPanelSize(g=g, width=display.width, height=display.height)
  } else if( !is.null(display.width)){
    g = palyoplot_setPanelSize(g=g ,margin= unit(1, "mm"), width=display.width)
  } else if( !is.null(display.height)){
    g = palyoplot_setPanelSize(g=g ,margin= unit(1, "mm"), height=display.height)
  }
  return(g)
}#.playoplot_buildGTable()
###

###
# Function: .palyoplot_buildBasicGTable  ###-------
###
.palyoplot_buildBasicGTable = function(
  p,
  p2,
  xlim = NULL,
  x.break = .2,
  x.reverse = FALSE,
  x.label = '',
  x.label.height = .5, #in cm
  x.label.text.gpar = gpar(fontsize = 10),
  x.label.pos = "bottom",
  x.tickwidth = 1, # how wide is each tick. Default = 1cm
  zones = NULL,
  zones.anno.width = 1,    #in cm annotation widths,
  xLimit = NULL,
  y.show = TRUE,
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
  plot.height = 10,    # in cm
  plot.spacer = .25,        # space between plots (in cm)
  plot.vspacer = .25,
  top.label.height = 2.25, # in cm
  display.height = NULL,      #use unit()
  display.width = NULL,       #use unit()
  plotnum='single'
){
  if( !is.null(zones)){
    direct = "vert"
    if( with( zones, exists('dir'))){
      direct = zones$dir[1]
    }
    p = .palyoplot_appendZones(p, zones, direct, anno=FALSE)
  }

  # create blank table to hold all the plots
  g = gtable(unit(.02, "cm"), unit(c(top.label.height,plot.height), "cm"))
  g1 = ggplot_gtable(ggplot_build(p))
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
  g = gtable_add_cols(g, unit(((xLimit * x.tickwidth)),"cm"))
  g = gtable_add_grob(g, g1$grobs[[which(g1$layout$name=="panel")]], l=-1, t=2)

  #add title
  if(!is.null(title)){
    txt  = textGrob(title, just=axis.title.x.just, rot=axis.title.x.angle, gp = title.gpar) #group label
    g = gtable_add_grob(g, txt, l=-1, t=1)
  }

  # #graph bottom border line
  g <- gtable_add_rows(g, unit(.03, c("cm")))
  g <- gtable_add_grob(g, rect, l=-1, t=-1)

  #copy the bottom axis info
  ia = which(g1$layout$name == "axis-b")
  ga = g1$grobs[[ia]]
  ax = ga$children[[2]]
  g = gtable_add_rows(g, unit(x.label.height, "cm"))
  #  g = gtable_add_rows(g, g1$heights[g1$layout[ia, ]$t])
  g = gtable_add_grob(g, ga, l=-1, t=-1)

  if(plotnum == 'multi'){
    #reposition x-axis label to top
    xia = which(g1$layout$name == "xlab-b")
    if(!is.null(xia)){
      xga = g1$grobs[[xia]]
      g = gtable_add_grob(g, xga, t=1, l=-1, clip="inherit")
    }
    #spacer between plots
    #    g = gtable_add_cols(g, unit(plot.spacer,"cm"))
  } else {
    #copy the bottom label
    g = gtable_add_rows(g, unit(plot.vspacer, "cm"))
    g = gtable_add_rows(g, unit(x.label.height, "cm")) #bottom label
    txt  = textGrob(x.label, hjust=axis.title.x.hjust, vjust=axis.title.x.vjust, gp = x.label.text.gpar)
    #figure out where to position it
    g = gtable_add_grob(g, txt, l=-1, t=6)
  }

  #attach 2ndary y-axis
  if( !is.null(p2) && y.show){ ###HERE - check this later
    #spacer between plots
    g = gtable_add_cols(g, unit(plot.spacer,"cm"), pos=0)

    g2 = ggplot_gtable(ggplot_build(p2))
    g = .palyoplot_do_yaxis(g, g2)
  }

  return(g)
}#.palyoplot_buildBasicGTable

.palyoplot_fakePlot = function(p, dfData, ydata, xlim, ylim, n, intervals, yREV){
  p = p + geom_area(data=dfData, aes(x=dfData$age, y=dfData$val),
                    colour="white", fill="white", inherit.aes=FALSE)
  lTmp = .palyoplot_buildCommonPlot( p,
                                     ydata,
                                     xlim,
                                     ylim,
                                     x.reverse=FALSE,
                                     y.label=NULL,
                                     y2=NULL,
                                     y2.label=NULL,
                                     n,
                                     intervals,
                                     yREV
  )
  p = lTmp[[1]]
  #pFake = .palyoplot_appendZones(pFake, zones, "horiz", anno=TRUE)

  return(p)
}
.palyoplot_2xaxis = function(p1, p2, side="top", xlab=NULL, top.spacer=unit(2, "cm"), height=NULL, width=NULL){

  ## extract gtable
  g1 = ggplot_gtable(ggplot_build(p1))
  g2 = ggplot_gtable(ggplot_build(p2))

  ## overlap the panel of the 2nd plot on that of the 1st plot
  pp = c(subset(g1$layout, name=="panel", se=t:r))

  ## steal axis from second plot and modify
  ia = which(g2$layout$name == "axis-b")
  ga = g2$grobs[[ia]]
  ax = ga$children[[2]]

  yia = which(g2$layout$name == "xlab")
  yga = g2$grobs[[yia]]

  g = gtable_add_grob(g1, g2$grobs[[which(g2$layout$name=="panel")]], pp$t, pp$l, pp$b, pp$l)

  if( side == "bottom"){
    rect = linesGrob(gp=gpar(col="black", lwd=2))
    #     g <- gtable_add_rows(g, unit(.02, c("cm")), pos=0)
    #     g <- gtable_add_grob(g, rect, 1, pp$r, pp$b)

    #move axis
    g <- gtable_add_rows(g, g2$heights[g2$layout[ia, ]$t], pos=-1)
    g <- gtable_add_grob(g, ga, -1, pp$r)

    #move label under axis
    g <- gtable_add_rows(g, g2$heights[g2$layout[yia, ]$t], pos=-1)
    g <- gtable_add_grob(g, yga, -1, pp$r)
  } else {
    #move axis
    g <- gtable_add_rows(g, g2$heights[g2$layout[ia, ]$t], pos=0)
    g <- gtable_add_grob(g, ga, -1, pp$r, pp$b)

    g <- gtable_add_rows(g, g2$heights[g2$layout[ia, ]$t], pos=0)
    g <- gtable_add_grob(g, yga, 1, pp$r, pp$b)
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
} #.palyoplot_2xaxis


.palyoplot_do_yaxis = function(g, gg){
  yia = which(gg$layout$name == "axis-l")
  yga = gg$grobs[[yia]]
  if(!is.null(yga$children)){
    yax = yga$children[[2]]

    rect = linesGrob(gp=gpar(col="black", lwd=2))
    g = gtable_add_cols(g, unit(.02, c("cm")), pos=0)
    g = gtable_add_grob(g, rect, t=2, l=1)

    g = gtable_add_cols(g, gg$widths[gg$layout[yia, ]$l], pos=0)
    g = gtable_add_grob(g, yax, t=2, l=1)

    yia = which(gg$layout$name == "ylab-l")
    yga = gg$grobs[[yia]]
    g = gtable_add_grob(g, yga, t=1, l=1, clip="off")
  }
  return(g)
} #.palyoplot_do_axis
###
