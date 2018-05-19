var eleLastDrag=null;
var eleCurrentDrag=null;
var eleModifyDrag=null;
var eleResizeDragNodeNE=null;
var eleResizeDragNodeNW=null;
var eleResizeDragNodeSE=null;
var eleResizeDragNodeSW=null;
var eleConnectorDrag=null;
var elePos={
	X:null,
	Y:null
}
var eleDragStartPos={
	X:null,
	Y:null
}
var eleDragEndPos={
	X:null,
	Y:null
}
var line={
	srcPos:null,
	destPos:null,
	element:null
}
		
function createDiagram(sidebarElement, graphElement){
	var sidebar={
		element: sidebarElement,
		bricks: null
	};
	var graph={
		element: graphElement,
		cells: null,
		selectedCell: null,
		lines:null
	};
	var editor={
		sidebar: sidebar,
		graph: graph
	};
	editor.graph.cells=new Array();
	editor.graph.lines=new Array();
	editor.sidebar.bricks=new Array();
	
	var ulElement = document.createElement('ul');
	ulElement.style.listStyleType='none';
	sidebarElement.appendChild(ulElement);
	
	graphElement.ondragover=function(evt){
		evt.preventDefault();
	}
	graphElement.ondrop=function(evt){
		if(eleCurrentDrag)
		{
			var dragNode = document.createElement('div');
			var imgNode = document.createElement('img');
			imgNode.setAttribute('src', eleCurrentDrag.src);
			dragNode.appendChild(imgNode);
			dragNode.style.position = 'absolute';
			dragNode.style.top = evt.pageY+'px';
			dragNode.style.left = evt.pageX+'px';
			dragNode.draggable='true';
			
			createBrickAnchorPoint(editor, dragNode, imgNode);
			
			dragNode.onclick=function(){
				editor.graph.selectedCell=dragNode;
				imgNode.style.border='2px dashed lime';
				if(eleLastDrag!=null)
				{
					for(var idx=1;idx<=5;idx++)
					{
						eleLastDrag.parentNode.childNodes[idx].style.visibility='hidden';
					}
					eleLastDrag.style.border='none';
				}
				eleLastDrag = imgNode;
				for(var idx=1;idx<=5;idx++)
				{
					eleLastDrag.parentNode.childNodes[idx].style.visibility='visible';
				}
			}
			dragNode.onmouseover=function(){
				dragNode.style.cursor = "move";
			}
			
			imgNode.ondragstart=function(evt){
				evt.dataTransfer.effectAllowed="move";
				evt.dataTransfer.setData('text', evt.target.innerHTML);
				evt.dataTransfer.setDragImage(evt.target, 0, 0);
				eleCurrentDrag = false;
				eleModifyDrag=evt.target;
				return true;
			}
			dragNode.ondragover=function(evt){
				if(eleConnectorDrag)
				{
					imgNode.style.border='3px solid lime';
				}
			}
			dragNode.ondragleave=function(evt){
				imgNode.style.border='none';
				for(var idx=1;idx<=5;idx++)
				{
					eleLastDrag.parentNode.childNodes[idx].style.visibility='hidden';
				}
			}
			imgNode.ondrop=function(evt){
				imgNode.style.border='none';
				for(var idx=1;idx<=5;idx++)
				{
					eleLastDrag.parentNode.childNodes[idx].style.visibility='hidden';
				}
				if(eleConnectorDrag)
				{
					eleDragEndPos.X = parseElementPosProperty(dragNode.childNodes[5].style.left) + parseElementPosProperty(dragNode.style.left);
					eleDragEndPos.Y = parseElementPosProperty(dragNode.childNodes[5].style.top) + parseElementPosProperty(dragNode.style.top);
					
					//alert('Start Pos: X-'+eleDragStartPos.X+',Y-'+eleDragStartPos.Y);
					//alert('Start Pos: X-'+eleDragEndPos.X+',Y-'+eleDragEndPos.Y);
					
					var canvasWidth = Math.abs(eleDragEndPos.X-eleDragStartPos.X);
					var canvasHeight = Math.abs(eleDragEndPos.Y-eleDragStartPos.Y);
					var canvasEle = document.createElement('canvas');
					var linContext = canvasEle.getContext('2d');
					canvasEle.style.position='absolute';
					canvasEle.setAttribute('width',canvasWidth);
					canvasEle.setAttribute('height',canvasHeight);
					canvasEle.setAttribute('class', 'line');
					
					if(eleDragEndPos.X < eleDragStartPos.X && eleDragEndPos.Y < eleDragStartPos.Y)//Direction: NorthWest
					{
						canvasEle.style.left = eleDragEndPos.X+'px';
						canvasEle.style.top = eleDragEndPos.Y+'px';
						linContext.beginPath();
						linContext.moveTo(0,0);
						
						var scaleX = eleDragStartPos.X / canvasWidth;
						var scaleY = eleDragStartPos.Y / canvasHeight;
						
						linContext.lineTo((eleDragStartPos.X / scaleX), (eleDragStartPos.Y / scaleY));
						linContext.closePath();
					}
					else if(eleDragEndPos.X > eleDragStartPos.X && eleDragEndPos.Y <  eleDragStartPos.Y)
					{
						canvasEle.style.left = eleDragEndPos.X-canvasEle.width+'px';
						canvasEle.style.top = eleDragEndPos.Y+'px';
						linContext.beginPath();
						
						var scaleX = eleDragEndPos.X / canvasWidth;
						var scaleY = eleDragEndPos.Y / canvasHeight;
						
						linContext.translate(canvasWidth, 0);
						linContext.rotate(90);
						linContext.moveTo(0,0);
						linContext.lineTo((eleDragEndPos.X / scaleX), (eleDragEndPos.Y / scaleY));
						linContext.closePath();
					}
					else if(eleDragEndPos.X < eleDragStartPos.X && eleDragEndPos.Y > eleDragStartPos.Y)
					{
						canvasEle.style.left = eleDragEndPos.X+'px';
						canvasEle.style.top = eleDragEndPos.Y-canvasEle.height+'px';
						linContext.beginPath();
						
						var scaleX = eleDragEndPos.X / canvasWidth;
						var scaleY = eleDragEndPos.Y / canvasHeight;
						
						linContext.translate(canvasWidth, 0);
						linContext.rotate(90);
						linContext.moveTo(0,0);
						linContext.lineTo((eleDragEndPos.X / scaleX), (eleDragEndPos.Y / scaleY));
						linContext.closePath();
					}
					else if(eleDragEndPos.X > eleDragStartPos.X && eleDragEndPos.Y > eleDragStartPos.Y)
					{
						canvasEle.style.left = eleDragEndPos.X-canvasEle.width+'px';
						canvasEle.style.top = eleDragEndPos.Y-canvasEle.height+'px';
						linContext.beginPath();
						
						var scaleX = eleDragEndPos.X / canvasWidth;
						var scaleY = eleDragEndPos.Y / canvasHeight;
						
						linContext.moveTo(0,0);
						linContext.lineTo((eleDragEndPos.X / scaleX), (eleDragEndPos.Y / scaleY));
						linContext.closePath();
					}
					linContext.fillStyle='#000000';
					linContext.fill();
					linContext.lineWidth=2;
					linContext.strokeStyle='lime';
					linContext.stroke();
					graphElement.appendChild(canvasEle);
				}
			}
			graphElement.appendChild(dragNode);
		}
		else if(eleModifyDrag)
		{
			//alert('Modify');
			
			var pX;
			var pY;
			//if(evt.pageX!=undefined && evt.pageX!=null)
			//{
				pX = evt.pageX;
				pY = evt.pageY;
				var brickElement = eleModifyDrag.parentNode;
				brickElement.style.top= pY +'px';
				brickElement.style.left=pX +'px';
			//}
		}
		else if(eleConnectorDrag)
		{
		}
		else if(eleResizeDragNodeNW)
		{
			//alert('Resize');
			
			eleDragEndPos.X = evt.pageX;
			eleDragEndPos.Y = evt.pageY;
			
			var tempValX = eleDragEndPos.X - eleDragStartPos.X;
			var tempValY = eleDragEndPos.Y - eleDragStartPos.Y;
			var heightAddon = Math.abs(tempValY);
			var widthAddon = Math.abs(tempValX);
			if(tempValX>0)
			{
				widthAddon=widthAddon*-1;
			}
			if(tempValY>0)
			{
				heightAddon=heightAddon*-1;
			}
			//alert(heightAddon+', '+widthAddon);
			var dragNode = eleResizeDragNodeNW.parentNode;
			dragNode.style.left = eleDragEndPos.X+'px';
			dragNode.style.top = eleDragEndPos.Y+'px';
			dragNode.childNodes[0].height = dragNode.childNodes[0].height + heightAddon;
			dragNode.childNodes[0].width = dragNode.childNodes[0].width + widthAddon;
			editor.graph.selectedCell=dragNode;
			
			updateBrickAnchorPointPos(dragNode);
		}
		else if(eleResizeDragNodeNE)
		{
			//alert('Resize');
			eleDragEndPos.X = evt.pageX;
			eleDragEndPos.Y = evt.pageY;
			//alert('Start Pos: X-'+eleDragStartPos.X+',Y-'+eleDragStartPos.Y);
			var tempValX = eleDragEndPos.X - eleDragStartPos.X;
			var tempValY = eleDragEndPos.Y - eleDragStartPos.Y;
			//alert(tempValX+', '+tempValY);
			var heightAddon = Math.abs(tempValY);
			var widthAddon = Math.abs(tempValX);
			if(tempValX<0)
			{
				widthAddon=widthAddon*-1;
			}
			if(tempValY>0)
			{
				heightAddon=heightAddon*-1;
			}
			//alert(widthAddon+', '+heightAddon);
			var dragNode = eleResizeDragNodeNE.parentNode;
			dragNode.childNodes[0].height = dragNode.childNodes[0].height + heightAddon;
			dragNode.childNodes[0].width = dragNode.childNodes[0].width + widthAddon;
			dragNode.style.top = eleDragEndPos.Y +'px';
			editor.graph.selectedCell=dragNode;
			
			updateBrickAnchorPointPos(dragNode);
		}
		else if(eleResizeDragNodeSW)
		{
			//alert('Resize');
			eleDragEndPos.X = evt.pageX;
			eleDragEndPos.Y = evt.pageY;
			//alert('Start Pos: X-'+eleDragStartPos.X+',Y-'+eleDragStartPos.Y);
			var tempValX = eleDragEndPos.X - eleDragStartPos.X;
			var tempValY = eleDragEndPos.Y - eleDragStartPos.Y;
			var heightAddon = Math.abs(tempValY);
			var widthAddon = Math.abs(tempValX);
			if(tempValX>0)
			{
				widthAddon=widthAddon*-1;
			}
			if(tempValY<0)
			{
				heightAddon=heightAddon*-1;
			}
			//alert(heightAddon+', '+widthAddon);
			var dragNode = eleResizeDragNodeSW.parentNode;
			dragNode.childNodes[0].height = dragNode.childNodes[0].height + heightAddon;
			dragNode.childNodes[0].width = dragNode.childNodes[0].width + widthAddon;
			dragNode.style.left = eleDragEndPos.X+'px';
			editor.graph.selectedCell=dragNode;
			
			updateBrickAnchorPointPos(dragNode);
		}
		else if(eleResizeDragNodeSE)
		{
			//alert('Resize');
			eleDragEndPos.X = evt.pageX;
			eleDragEndPos.Y = evt.pageY;
			//alert('Start Pos: X-'+eleDragStartPos.X+',Y-'+eleDragStartPos.Y);
			var tempValX = eleDragEndPos.X - eleDragStartPos.X;
			var tempValY = eleDragEndPos.Y - eleDragStartPos.Y;
			//alert(tempValX+', '+tempValY);
			var heightAddon = Math.abs(tempValY);
			var widthAddon = Math.abs(tempValX);
			if(tempValX<0)
			{
				widthAddon=widthAddon*-1;
			}
			if(tempValY<0)
			{
				heightAddon=heightAddon*-1;
			}
			//alert(widthAddon+', '+heightAddon);
			var dragNode = eleResizeDragNodeSE.parentNode;
			dragNode.childNodes[0].height = dragNode.childNodes[0].height + heightAddon;
			dragNode.childNodes[0].width = dragNode.childNodes[0].width + widthAddon;
			editor.graph.selectedCell=dragNode;
			
			updateBrickAnchorPointPos(dragNode);
		}
	}
	
	return editor;
}

function createBrickAnchorPoint(editor, dragNode, imgNode){
	//create eight point
	var dragLinkNW = document.createElement('div');
	dragLinkNW.style.position='absolute';
	dragLinkNW.style.top='-2px';
	dragLinkNW.style.left='-2px';
	dragLinkNW.style.border = '1px solid black';
	dragLinkNW.style.visibility='hidden';
	dragLinkNW.style.width='5px';
	dragLinkNW.style.height='5px';
	dragLinkNW.style.cursor='nw-resize';
	dragLinkNW.draggable='true';
	dragLinkNW.ondragstart=function(evt){
		evt.dataTransfer.effectAllowed='move';
		evt.dataTransfer.setData('text', evt.target.innerHTML);
		evt.dataTransfer.setDragImage(evt.target, 0,0);
		eleCurrentDrag=null;
		eleModifyDrag=null;
		eleResizeDragNodeNW=dragLinkNW;
		eleResizeDragNodeNE=null;
		eleResizeDragNodeSE=null;
		eleResizeDragNodeSW=null;
		eleConnectorDrag=null;
		editor.graph.selectedCell=null;
		eleDragStartPos.X = evt.pageX;
		eleDragStartPos.Y = evt.pageY;
		return true;
	}
	dragLinkNW.ondragend=function(evt){
		eleResizeDragNode=false;
		return false;
	}
	dragNode.appendChild(dragLinkNW);
	
	var dragLinkNE = document.createElement('div');
	dragLinkNE.style.position='absolute';
	dragLinkNE.style.top='-2px';
	dragLinkNE.style.left=imgNode.width+'px';
	dragLinkNE.style.border = '1px solid black';
	dragLinkNE.style.visibility='hidden';
	dragLinkNE.style.width='5px';
	dragLinkNE.style.height='5px';
	dragLinkNE.style.cursor='ne-resize';
	dragLinkNE.draggable='true';
	dragLinkNE.ondragstart=function(evt){
		evt.dataTransfer.effectAllowed='move';
		evt.dataTransfer.setData('text', evt.target.innerHTML);
		evt.dataTransfer.setDragImage(evt.target, 0, 0);
		eleCurrentDrag=null;
		eleModifyDrag=null;
		eleResizeDragNodeNW=null;
		eleResizeDragNodeNE=dragLinkNE;
		eleResizeDragNodeSE=null;
		eleResizeDragNodeSW=null;
		eleConnectorDrag=null;
		editor.graph.selectedCell=null;
		eleDragStartPos.X = evt.pageX;
		eleDragStartPos.Y = evt.pageY;
		return true;
	}
	dragLinkNE.ondragend=function(evt){
		eleResizeDragNode=false;
		return false;
	}
	dragNode.appendChild(dragLinkNE);
	
	var dragLinkSW = document.createElement('div');
	dragLinkSW.style.position='absolute';
	dragLinkSW.style.top=imgNode.height+'px';
	dragLinkSW.style.left='-2px';
	dragLinkSW.style.border = '1px solid black';
	dragLinkSW.style.visibility='hidden';
	dragLinkSW.style.width='5px';
	dragLinkSW.style.height='5px';
	dragLinkSW.style.cursor='sw-resize';
	dragLinkSW.draggable='true';
	dragLinkSW.ondragstart=function(evt){
		evt.dataTransfer.effectAllowed='move';
		evt.dataTransfer.setData('text', evt.target.innerHTML);
		evt.dataTransfer.setDragImage(evt.target, 0,0);
		eleCurrentDrag=null;
		eleModifyDrag=null;
		eleResizeDragNodeNW=null;
		eleResizeDragNodeNE=null;
		eleResizeDragNodeSW=dragLinkSW;
		eleResizeDragNodeSE=null;
		eleConnectorDrag=null;
		editor.graph.selectedCell=null;
		eleDragStartPos.X = evt.pageX;
		eleDragStartPos.Y = evt.pageY;
		return true;
	}
	dragLinkSW.ondragend=function(evt){
		eleResizeDragNode=false;
		return false;
	}
	dragNode.appendChild(dragLinkSW);
	
	var dragLinkSE = document.createElement('div');
	dragLinkSE.style.position='absolute';
	dragLinkSE.style.top=imgNode.height+'px';
	dragLinkSE.style.left=imgNode.width+'px';
	dragLinkSE.style.border = '1px solid black';
	dragLinkSE.style.visibility='hidden';
	dragLinkSE.style.width='5px';
	dragLinkSE.style.height='5px';
	dragLinkSE.style.cursor='se-resize';
	dragLinkSE.draggable='true';
	dragLinkSE.ondragstart=function(evt){
		evt.dataTransfer.effectAllowed='move';
		evt.dataTransfer.setData('text', evt.target.innerHTML);
		evt.dataTransfer.setDragImage(evt.target, 0,0);
		eleCurrentDrag=null;
		eleModifyDrag=null;
		eleResizeDragNodeNW=null;
		eleResizeDragNodeNE=null;
		eleResizeDragNodeSW=null;
		eleResizeDragNodeSE=dragLinkSE;
		eleConnectorDrag=null;
		editor.graph.selectedCell=null;
		eleDragStartPos.X = evt.pageX;
		eleDragStartPos.Y = evt.pageY;
		return true;
	}
	dragLinkSE.ondragend=function(evt){
		eleResizeDragNode=false;
		return false;
	}
	dragNode.appendChild(dragLinkSE);
	
	var dragConnector = document.createElement('div');
	dragConnector.draggable='true';
	dragConnector.style.position='absolute';
	dragConnector.style.top=imgNode.height/2+'px';
	dragConnector.style.left=imgNode.width/2+'px';
	dragConnector.style.border = '1px solid black';
	dragConnector.style.visibility='hidden';
	dragConnector.style.width='5px';
	dragConnector.style.height='5px';
	dragConnector.style.cursor='pointer';
	dragConnector.draggable='true';
	dragConnector.ondragstart=function(evt){
		evt.dataTransfer.effectAllowed='move';
		evt.dataTransfer.setData('text', evt.target.innerHTML);
		evt.dataTransfer.setDragImage(evt.target, 0,0);
		editor.graph.selectedCell=null;
		eleCurrentDrag=null;
		eleModifyDrag=null;
		eleResizeDragNodeNW=null;
		eleResizeDragNodeNE=null;
		eleResizeDragNodeSW=null;
		eleResizeDragNodeSE=null;
		eleConnectorDrag=dragConnector;
		eleDragStartPos.X = evt.pageX;
		eleDragStartPos.Y = evt.pageY;
		return true;
	}
	dragConnector.ondragend=function(evt){
		
	}
	dragNode.appendChild(dragConnector);
}

function updateBrickAnchorPointPos(dragNode)
{
	var imgNode = dragNode.childNodes[0];
	var dragLinkNW = dragNode.childNodes[1];
	var dragLinkNE = dragNode.childNodes[2];
	var dragLinkSW = dragNode.childNodes[3];
	var dragLinkSE = dragNode.childNodes[4];
	var dragConnector = dragNode.childNodes[5];
	
	
	dragLinkNW.style.top='-2px';
	dragLinkNW.style.left='-2px';
	dragLinkNE.style.top='-2px';
	dragLinkNE.style.left=imgNode.width+'px';
	dragLinkSW.style.top=imgNode.height+'px';
	dragLinkSW.style.left='-2px';
	dragLinkSE.style.top=imgNode.height+'px';
	dragLinkSE.style.left=imgNode.width+'px';
	dragConnector.style.top=imgNode.height/2+'px';
	dragConnector.style.left=imgNode.width/2+'px';
}

function hideBrickAnchorPoint(dragNode){
	
}

function addSidebarBrick(editor, imgSrc){
	var liNode=document.createElement('li');
	liNode.style.padding='5px';
	
	var imgNode = document.createElement('img');
	imgNode.setAttribute('src', imgSrc);
	imgNode.setAttribute('class', 'diagram-brick');
	imgNode.setAttribute('draggable', 'true');
	imgNode.ondragstart=function(evt){
		evt.dataTransfer.effectAllowed="move";
		evt.dataTransfer.setData('text', evt.target.innerHTML);
		evt.dataTransfer.setDragImage(evt.target, 0, 0);
		eleCurrentDrag = evt.target;
		return true;
	}
	imgNode.ondragend=function(evt){
		evt.dataTransfer.clearData('text');
		eleCurrentDrag=null;
		return false;
	}
	liNode.appendChild(imgNode);
	editor.sidebar.element.childNodes[1].appendChild(liNode);
}

function parseElementPosProperty(posProperty){
	var propertyVal = posProperty;
	var idx = propertyVal.indexOf('p');
	var val = propertyVal.substr(0, idx);
	return parseFloat(val);
}