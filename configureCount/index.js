const _ = (sel) => {
  return document.querySelector(sel); 
}; 

const onChange = (el, cb) => {
  el.addEventListener('change', cb, false); 
}; 

const [
  monthEl,
  weekEl,
  dayEl,
  minuteEl,
  secondEl,
  dropRects,
  dragRects
] = [
  _('#monthsEl'),
  _('#weeksEl'),
  _('#daysEl'),
  _('#minutesEl'),
  _('#secondsEl'),
  _('#dropRects'),
  _('#dragRects')
]; 

const orderParts = [
  monthsEl,
  weeksEl,
  daysEl,
  hoursEl,
  minutesEl,
  secondsEl
]; 

const updateOrderParts = (e) => {
  let rectIdx = 1; 
  
  dropRects.innerHTML = null; 
  dragRects.innerHTML = null; 

  orderParts.forEach((el) => {
    if(!el.checked) return; 

    const dropRect = document.createElement('div');
    dropRect.innerHTML = rectIdx; 
    dropRect.addEventListener('drop', (e) => {
      const id = e.dataTransfer.getData('id');
      const dropRectChldrn = dropRect.children; 

      if(dropRectChldrn.length > 0) {
        dragRects.appendChild(dropRectChldrn[0]); 
      }

      dropRect.innerHTML = null;
      dropRect.appendChild(_('#' + id));  
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
    dragRect.addEventListener('click', (e) => {
      const children = dropRects.children;

      for(let i = 0; i < children.length; i++) {
        if(children[i].children.length === 0){
          children[i].innerHTML = null; 
          children[i].appendChild(e.target); 
          break; 
        }
      }
    });
    dragRects.appendChild(dragRect); 

    rectIdx += 1;  
  });
};

orderParts.forEach((el) => {
  onChange(el, updateOrderParts); 
}); 

// do first run 
updateOrderParts(); 