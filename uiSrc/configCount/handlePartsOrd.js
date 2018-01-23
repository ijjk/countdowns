/* eslint-disable */

(() => {

  orderPartsKeys = Object.keys(orderParts); 

  const updateOrder = () => {
    const dropRectChldrn = dropRects.children; 
    let order = []; 
  
    for(let i = 0; i < dropRectChldrn.length; i++) {
      const child = dropRectChldrn[i]; 
      const childsChild = child.children[0]; 
      order.push(childsChild.id.replace('OrdEl', ''));
    }
  
    countConf.order = order;
    updatePrev(); 
  }; 
  
  const updateOrderParts = (e) => {
    let rectIdx = 0; 
    dropRects.innerHTML = null; 
  
    countConf.order.forEach((part) => {
      const el = orderParts[part + 'El']; 
  
      if(!el.checked) return; 
  
      const dropRect = document.createElement('div');
     
      dropRect.addEventListener('drop', (e) => {
        const id = e.dataTransfer.getData('id');
        const dropRectChldrn = dropRect.children; 
  
        if(dropRectChldrn.length > 0) {
          const dropRectsChldrn = dropRects.children; 
  
          for(let i = 0; i < dropRectsChldrn.length; i++) {
            const child = dropRectsChldrn[i]; 
            const childsChild = child.children[0]; 
  
            if(childsChild.id === id) {
              child.appendChild(dropRectChldrn[0]); 
              break; 
            }
          }
        }
  
        dropRect.innerHTML = ''; 
        dropRect.appendChild(_('#' + id));  
  
        updateOrder(); 
        e.preventDefault(); 
      });
     
      dropRect.addEventListener('dragover', (e) => {
        e.preventDefault(); 
      }); 
     
      dropRects.appendChild(dropRect);
  
      const dragRect = document.createElement('div'); 
      dragRect.innerHTML = el.title; 
      dragRect.id = el.title + 'OrdEl'; 
      dragRect.draggable = true; 
      
      dragRect.addEventListener('dragstart', (e) => {
        e.dataTransfer.setData('id', el.title + 'OrdEl'); 
      }); 
   
      dropRect.appendChild(dragRect); 
  
      rectIdx += 1;  
    });
    
    updateOrder(); 
  };
  
  // custom order is lost when a countdown part is added
  const addToOrderParts = (e) => {
    const el = e.target; 
    
    if(el.checked) {
      let toSort = [
        el.title,
        ...countConf.order
      ]; 
      let toAdd = []; 
  
      orderPartsKeys.forEach((key) => {
        const part = key.substring(0, key.length - 2);
        if(toSort.indexOf(part) > -1) {
          toAdd.push(part); 
        }
      });
  
      countConf.order = toAdd; 
    }
    else if(countConf.order.indexOf(el.title) > -1) {
      countConf.order = countConf.order.filter((p) => p !== el.title); 
    }
  
    updateOrderParts(); 
  };
  
  orderPartsKeys.forEach((key) => {
    const el = orderParts[key]; 
    onChange(el, addToOrderParts); 
  }); 
  
  // do first run 
  updateOrderParts();

})();