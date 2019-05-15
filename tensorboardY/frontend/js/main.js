// global variables
var current_capture_id = null;
var id2current = {};


/////// functions
function getBase64Image(img) {
  var canvas = document.createElement("canvas");
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  var ctx = canvas.getContext("2d");
  ctx.drawImage(img, 0, 0);
  var dataURL = canvas.toDataURL("image/png");
  return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
}

function startUpload(fileList, id) {
  let file = null;
  for (let i = 0; i < fileList.length; i++) {
    if (fileList[i].type.match(/^image\//)) {
      file = fileList[i];
      break;
    }
  }
  if (file !== null) {
    let obj = document.getElementById(id);
    obj.src = URL.createObjectURL(file);
    return true;
  }
  return false;
}

function log_switch(tyid, displayid, newid) {
  // 1) if displayid is new, hide previous. 2) show the new one. 3) end callbac on previous
  let oldinfo = id2current[tyid];
  let prev_exists = oldinfo != null;
  if (prev_exists) {
    var oldid = oldinfo[0];
    var olddisplay = oldinfo[1];
  }
  id2current[tyid] = [newid, displayid];
  document.getElementById(newid).tydisplay();
  if (prev_exists && olddisplay != displayid) {
    document.getElementById(olddisplay).classList.add('tyarg-hidden');
  }
  if (!prev_exists || olddisplay != displayid) {
    document.getElementById(displayid).classList.remove('tyarg-hidden');
  }
  if (prev_exists && oldid != newid) {
    document.getElementById(oldid).tyreset();
  }
}

/////// initialize current display values
$(".tyarg-header").each(function ( index ) {
  id2current[index] = null;
});

// querying example img
$(".ty-ex-img").each(function ( index ) {
  let obj = this;
  obj.tyid = obj.id.split("-")[0];
  obj.tydisplayid = `${obj.tyid}-tyarg-img`;
  obj.tyreset = () => {
    obj.value = 'ty-nothing';
  }
  obj.tydisplay = () => {
    document.getElementById(obj.tydisplayid).src = obj.newimg;
    obj.newimg = null;
  }
  obj.collect_active = () => {
    return {'kind': 'img', 'data': getBase64Image(document.getElementById(obj.tydisplayid))}
  }
  obj.onchange = (evt) => {
    cmd = {'cmd': 'get_data', 'tyid': parseInt(obj.tyid),
            'info': {'gui': 'upload_img', 'opt_id': evt.target.selectedIndex - 1}};
    axios.post('', cmd)
      .then(function (res) {
        obj.newimg = "data:image/png;base64," + encodeURIComponent(res.data);
        log_switch(obj.tyid, obj.tydisplayid, obj.id);
      })
      .catch(function (err) {
        console.log('img example failed!!!');
        console.log(err);
      })
  }
});

// querying example txt
$(".ty-ex-txt").each(function ( index ) {
  let obj = this;
  obj.tyid = obj.id.split("-")[0];
  obj.tydisplayid = `${obj.tyid}-tyarg-writing`;
  obj.tyreset = () => {
    obj.value = 'ty-nothing';
  }
  obj.tydisplay = () => {
    document.getElementById(obj.tydisplayid).value = obj.newvalue;
    obj.newvalue = null;
  }
  obj.collect_active = () => {
    return {'kind': 'ignore', 'data': document.getElementById(obj.tydisplayid).value}
  }
  obj.onchange = (evt) => {
    cmd = {'cmd': 'get_data', 'tyid': parseInt(obj.tyid),
            'info': {'gui': 'upload_txt', 'opt_id': evt.target.selectedIndex - 1}};
    axios.post('', cmd)
      .then(function (res) {
        obj.newvalue = res.data;
        log_switch(obj.tyid, obj.tydisplayid, obj.id);
      })
      .catch(function (err) {
        console.log('txt example failed!!!');
        console.log(err);
      })
  }
});

// querying example option
$(".ty-options").each(function ( index ) {
  let obj = this;
  obj.tyid = obj.id.split("-")[0];
  obj.tydisplayid = `${obj.tyid}-tyarg-writing`;
  obj.tyreset = () => {
    obj.value = 'ty-nothing';
  }
  obj.tydisplay = () => {
    document.getElementById(obj.tydisplayid).value = obj.value;
  }
  obj.collect_active = () => {
    return {'kind': 'opt_id', 'data': obj.selectedIndex - 1};
  }
  obj.onchange = (evt) => {
    log_switch(obj.tyid, obj.tydisplayid, obj.id);
  }
});

/////// ty text input
$(".tyarg-text-in").each(function ( index ) {
  let obj = this;
  obj.tyid = obj.id.split("-")[0];
  obj.tydisplayid = `${obj.tyid}-tyarg-writing`;
  obj.tyreset = () => { };
  obj.tydisplay = () => {
    document.getElementById(obj.tydisplayid).value = obj.value;
  };
  obj.collect_active = () => {
    return {'kind': 'ignore', 'data': document.getElementById(obj.tydisplayid).value}
  }
});
$( ".tyarg-write-btn" ).each(function( index ) {
  let obj = this;
  obj.tyid = obj.id.split("-")[0];
  obj.displayid = `${obj.tyid}-tyarg-writing`;
  obj.newid = `${obj.tyid}-tyarg-text-in`;
  this.addEventListener('click', function (e) {
    log_switch(obj.tyid, obj.displayid, obj.newid);
  });
});

// uploading images
$( ".tyarg-img-upload" ).each(function( index ) {
  let obj = this;
  obj.tyid = obj.id.split("-")[0];
  obj.tydisplayid = `${obj.tyid}-tyarg-img`;
  obj.tyreset = () => { };
  obj.tydisplay = () => {
    document.getElementById(obj.tydisplayid).src = obj.newimg;
    obj.newimg = null;
  };
  obj.collect_active = () => {
    return {'kind': 'img', 'data': getBase64Image(document.getElementById(obj.tydisplayid))}
  }
  obj.addEventListener('change', function (e) {
    e.preventDefault();
    obj.newimg = URL.createObjectURL(e.target.files[0])
    log_switch(obj.tyid, obj.tydisplayid, obj.id);
  });
});

// capturing images
$('#img-capture-btn').on('click', function (e) {
  const canvas = document.getElementById('ty-canvas');
  const context = canvas.getContext('2d');
  const player = document.getElementById('ty-player');
  canvas.width = player.videoWidth;
  canvas.height = player.videoHeight;
  context.drawImage(player, 0, 0);
  let obj = document.getElementById(`${current_capture_id}-tyarg-img-capture`);
  obj.newimg = canvas.toDataURL('image/png');
  log_switch(current_capture_id, obj.tydisplayid, obj.id);
  $('#exampleModalCenter').modal('hide');
});
$('#exampleModalCenter').on('hidden.bs.modal', function (e) {
  const player = document.getElementById('ty-player');
  try {
    player.srcObject.getVideoTracks().forEach(track => track.stop());
  } catch (err) {
    console.log(err);
  }
});
$('#exampleModalCenter').on('shown.bs.modal', function (e) {
  const player = document.getElementById('ty-player');
  navigator.mediaDevices.getUserMedia({video: true})
      .then((stream) => {
        player.srcObject = stream;
      })
      .catch((err) => {
        $('#exampleModalCenter').modal('hide');
        console.log(err);
      });
});
$( ".tyarg-img-capture" ).each(function( index ) {
  let obj = this;
  obj.tyid = obj.id.split("-")[0]
  obj.tydisplayid = `${obj.tyid}-tyarg-img`;
  obj.newimg = null;
  obj.tyreset = () => { };
  obj.tydisplay = () => {
    document.getElementById(obj.tydisplayid).src = obj.newimg;
    obj.newimg = null;
  };
  obj.collect_active = () => {
    return {'kind': 'img', 'data': getBase64Image(document.getElementById(obj.tydisplayid))}
  }
  obj.addEventListener('click', function (e) {
    current_capture_id = obj.tyid
    $('#exampleModalCenter').modal('show');
  });
});

// boolean
$( ".tybool" ).each(function( index ) {
  let obj = this;
  obj.tyid = obj.id.split("-")[0]
  obj.tydisplayid = `${obj.tyid}-tyarg-writing`;
  obj.tyreset = () => { };
  obj.tydisplay = () => {
    document.getElementById(obj.tydisplayid).value = obj.innerHTML;
  };
  obj.collect_active = () => {
    if (obj.innerHTML == 'True')
      return {'kind': 'bool', 'data': 'True'}
    return {'kind': 'bool', 'data': 'False'}
  }
  obj.addEventListener('click', function (e) {
    log_switch(obj.tyid, obj.tydisplayid, obj.id);
  });
});

// slider
$('.ty-slider').each(function ( index ) {
  let obj = this;
  obj.tyid = obj.id.split("-")[0];
  obj.tydisplayid = `${obj.tyid}-tyarg-writing`;
  obj.tyreset = () => { };
  obj.tydisplay = () => {
    document.getElementById(obj.tydisplayid).value = obj.value;
  }
  obj.collect_active = () => {
    return {'kind': 'ignore', 'data': obj.value}
  }
  obj.oninput = function (e) {
    log_switch(obj.tyid, obj.tydisplayid, obj.id);
  }
  obj.onclick = function (e) {
    log_switch(obj.tyid, obj.tydisplayid, obj.id);
  }
})





///// Run it!
$('.ty-warning').each(function ( index ) {
  let obj = this;
  obj.tyid = obj.id.split('-')[0];
  obj.tydisplayid = `${obj.tyid}-ty-warning`;
  obj.tyreset = () => { };
  obj.tydisplay = () => { };
})

$("#ty-runit").click ( function (evt) {
  let all_set = true;
  let prep_args = [];
  for (tyid in id2current) {
    let oldinfo = id2current[tyid];
    if (oldinfo == null || $(document.getElementById(oldinfo[0])).hasClass('ty-warning')) {
      log_switch(tyid, `${tyid}-ty-warning`, `${tyid}-ty-warning`);
      all_set = false;
    }
    else {
      prep_args.push(document.getElementById(oldinfo[0]).collect_active());
    }
  }
  if (all_set) {
    cmd = {'cmd': 'arg_delivery', 'args': prep_args};
    axios.post('', cmd)
      .then(function (res) {
        if (res.data.kind == 'html') {
          document.getElementById('ty-output').innerHTML = res.data.data;
          document.getElementById('ty-output-card').style.display = 'block';
        }
        if (res.data.kind == 'img') {
          let img = `data:image/png;base64,${encodeURIComponent(res.data.data)}`;
          document.getElementById('ty-output').innerHTML = `<img class="card-img" title="" data-toggle="tooltip" id="ty-final-img">`
          let obj = document.getElementById('ty-final-img');
          $(obj).tooltip();
          obj.onload = () => {
            $(obj).attr('data-original-title', `${obj.naturalHeight} x ${obj.naturalWidth}`);
          }
          obj.onclick = () => toggleFullscreen(obj);
          obj.src = img;
          document.getElementById('ty-output-card').style.display = 'block';
        }
      })
      .catch(function (error) {
        console.log('model forward pass fail!!!');
        console.log(error);
      })
  }
});

// Full screen image experiment
function toggleFullscreen(elem) {
  elem = elem || document.documentElement;
  if (!document.fullscreenElement && !document.mozFullScreenElement &&
    !document.webkitFullscreenElement && !document.msFullscreenElement) {
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) {
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) {
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) {
      elem.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    }
  }
}

$("img").each(function ( index ) {
  let obj = this;
  obj.onclick = () => toggleFullscreen(obj);
  obj.onload = () => {
    $(obj).attr('data-original-title', `${obj.naturalHeight} x ${obj.naturalWidth}`);
  }
});

// turn on tooltips
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})
