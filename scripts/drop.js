

var DROPZONE = "";
function setupDropZone(target) {
   if (!target) {
     target = "#dropZone";
   }
   var dropZone = document.querySelector(target);
   DROPZONE = dropZone;

   window.addEventListener('dragenter', function(event) {
      showDropZone();
      console.log("window dragenter event");
   });

   dropZone.addEventListener('dragenter', allowDrag);
   dropZone.addEventListener('dragover', allowDrag);
   dropZone.addEventListener('dragleave', function(event) {
      hideDropZone();
   });
   dropZone.addEventListener('drop', handleDrop);
}


function showDropZone(dropZone) {
   if (!dropZone) {
     dropZone = DROPZONE;
   }
   dropZone.style.visibility = "visible";
}

function hideDropZone(dropZone) {
   if (!dropZone) {
     dropZone = DROPZONE;
   }
   dropZone.style.visibility = "hidden";
}

function allowDrag(event) {
   if (true) {  // Test that the item being dragged is a valid one
      event.dataTransfer.dropEffect = 'copy';
      event.preventDefault();
   }
}

function handleDrop(event) {
   event.preventDefault();
   hideDropZone();

   var file;
   var files = event.dataTransfer.files;
   for (var i=0; i<files.length; i++) {
      file = files[i];
      console.log("NAME", escape(file.name));
      console.log("SIZE", file.size);
      console.log("DATE", file.lastModifiedDate.toLocaleDateString());
      var reader = new FileReader();
      reader.onload = function (event) {
         var content = reader.result;
         // console.log(content);
 	 var aton = new ATON();
	 var data = aton.parse(content);
         prepareCards(data);
      };
      // reader.readAsDataURL(file); // loads MIME64 version of file
      reader.readAsBinaryString(file);
      break;   // only reading the first file if more than one.
   }
}


