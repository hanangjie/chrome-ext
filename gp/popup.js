var nowid = '';
var isNew = true;
var gpList = {};
var gpObj = {};
var gplength = 0;
function callit(data) {
  if(!data.data) {
    $('#error').html('Error: No value specified');
    return
  } else {
    $('#error').html('');
  }
    const price = data.data.trends[data.data.trends.length-1].split(',')[1];
    gpObj[nowid].data =  `${data.data.name}: ${price} `;
    gpObj[nowid].getMoney = ((price- (gpList[nowid].isNew? gpList[nowid].cb:data.data.prePrice))*gpList[nowid].gu).toFixed(2)
    gpObj[nowid].allMoney = ((price- gpList[nowid].cb)*gpList[nowid].gu).toFixed(2)
}
function callit2(data) {
  if(!data.data) {
    $('#error').html('Error: No value specified')
    return
  } else {
    $('#error').html('');
  }
  gpObj[nowid].diff = +data.data.f170;
  gpObj[nowid].percent = data.data.f170+ '%' + ' h:'+ data.data.f168;
}

function start(id) {
    gpObj[id] = {id};
    getId(id);
    getPrice(id);
}

function print() {
    var all = 0;
    var html = '';
    var list = Object.values(gpObj);
    list.sort((v1, v2) => v2.diff - v1.diff);
    list.forEach((item) => {
      html += `<li>${item.id+' '+item.data + item.percent} <span data-id="${item.id}" >删除</span></li>`
    })
    $('#list').html(html)
    var t= new Date()
}

function deleteItem(id) {
  delete gpList[id]
  getInfo()
}

function getId(id) {
    const type = id[0] == 6 ? 1 : 0
    fetch('https://push2.eastmoney.com/api/qt/stock/trends2/get?secid='+type+'.'+id+'&fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13,f170&fields2=f51,f52,f53,f54,f55,f56,f57,f58,f170&ut=4d2cd9e55b669a2b3dec49542914281d&iscr=0&cb=callit&isqhquote=&callit=callit').then((res)=> {
        return res.text()
    }).then((data) => {
        gplength++;
        nowid = id;
        new Function(data)();
        if(gplength === (2*Object.keys(gpList).length)) {
            print()
        }
    })
}

function getPrice(id) {
    const type = id[0] == 6 ? 1 : 0
    const url = 'https://push2.eastmoney.com/api/qt/stock/get?invt=2&fltt=2&ut=a79f54e3d4c8d44e494efb8f748db291&secid='+type+'.'+id+'&fields=f43,f169,f170,f47,f48,f117,f168,f171,f162,f59,f78,f127,f198,f199,f262,f107&cb=callit2&_=1642751047839'
    
    fetch(url).then((res) => {return res.text()}).then((data) => {
        nowid = id;
        gplength++;
        new Function(data)();
        if(gplength === (2*Object.keys(gpList).length)) {
            print()
        }
    })
}
getInfo()
setInterval(() => {
  nowid = '';
  gpObj = {};
  getInfo()
}, 10*1000)

function getInfo() {
  gplength = 0;
  var gp = Object.keys(gpList);
  if(!gp.length) {
    $('#list').html('')
    return;
  }
  chrome.storage.sync.set({'value': gpList}, function() {
    // Notify that we saved.
  });
  gp.forEach((item) => start(`${item}`));
}

$(function(){
  
  chrome.storage.sync.get('value', function(item) {
    // Notify that we saved.
    gpList = item.value || {}
    getInfo()
  });
  $('#add').click(() => {
    var value = $('#code').val();
    gpList[value] = {gu:0,cb:11.026}
    getInfo()
  })
  $('#list').on('click', (item) => {
    var data = $(item.target).data();
    deleteItem(data.id)
  })
  $('#code').on('change', () => {
    var that = $(this);
    
  })
})