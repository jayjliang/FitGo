$(document).ready(function() {
	function init() {
		$("#infoTip").hide();
		$("#passwordTip").hide();
		$('#changeKey').click(function(event) {
			$('#changePassword').toggle();
		});
		// $('.planbtn').click(function(event) {
		// 	$('#changePassword').hide('slow/400/fast');
		// });
		$("#menu .home").removeClass("home");
		$($("#menu .bar").get(2)).addClass("home");
		$('#subPor').click(function(event) {
			window.location.href="/plans/Info";
		});
	}
	init();
	showInformation();
	changeInformation();
	changePassword();
});

function moreTags(event) {
	if (event.keyCode == 13) {
		var value = $('.inputTag').val();
		$('.inputTag').before('<span class="tag">' + value + '<span onclick="closeTag(event)" class="icon-remove" style="font-size:10px;color:#343a63"></span></span>');
		$('.inputTag').val("");
	}
}

function closeTag(event) {
	// console.log(event.target);
	$(event.target).parent().remove();
}


// 更改个人信息
function changeInformation() {
	var uid = $("#uid").attr('value');
	$("#submitInfo").click(function(event) {
		var gender = $("input[name='gender']:checked").val();
		var tag = '';
		$(".tag").each(function(index, el) {
			if (tag) {
				tag = tag + ',' + $(this).text();
			} else {
				tag = $(this).text();
			}
		});
		jQuery.ajax({
			url: '/user/userpage/' + uid,
			type: 'POST',
			dataType: 'json',
			data: {
				'name': $("#user_name").val(),
				'gender': gender,
				'school': $("#school").val(),
				'campus': $("#campus").val(),
				'info_phone': $("#info_phone").val(),
				'signature': $("#signature").val(),
				'tag': tag
			},
			success: function(data, textStatus, xhr) {
				//called when successful
				if (data['code'] == 200) {
					// $("#infoTip").attr('class','alert alert-success');
					$("#infoTip").html("Change Successful!");
					$("#infoTip").show();
					showInformation();
					setTimeout(function() {
					$("#infoTip").hide();
					},1000);
				} else {
					$("#infoTip").html(data['content']);
					$("#infoTip").show();
				}
			},
			error: function(xhr, textStatus, errorThrown) {
				//called when there is an error
				$("#infoTip").html('Network Error!');
				$("#infoTip").show();
			}
		});

		// alert(jQuery.parseJSON(info));
		// var tag = {

		// }
	});

};


//获取，展示个人信息
function showInformation() {
	var uid = $("#uid").attr('value');
	jQuery.ajax({
		url: '/user/userinfo/' + uid,
		type: 'POST',
		dataType: 'json',
		success: function(data, textStatus, xhr) {
			if (data['code'] == 200) {
				$("#user_name").attr('value', data['info']['name']);
				$("#yourname").text(data['info']['name']);
				if (data['info']['gender']) {
					$("#" + data['info']['gender']).attr('checked', 'checked');
				}
				$("#school").attr('value', data['info']['school']);
				$("#campus").attr('value', data['info']['campus']);
				$("#info_email").val(data['info']['info_email']);
				$("#info_phone").attr('value', data['info']['info_phone']);
				$("#signature").val(data['info']['signature']);
				$("#tagArea").html('');
				if(data['tag']){
				for(var i=0;i<data['tag']['user_enjoyment'].length;i++){
					$("#tagArea").append('<span class="tag">'+data['tag']['user_enjoyment'][i]+'<span onclick="closeTag(event)" class="icon-remove" style="font-size:10px;color:#343a63"></span></span>');
				}
				}
				$("#tagArea").append('<input type="text" placeholder class="inputTag" onkeydown="moreTags(event)" >');
			} else {
				$("#infoTip").html(data['content']);
				$("#infoTip").show();
			}
		},
		error: function(xhr, textStatus, errorThrown) {
			$("#infoTip").html('Network Error!');
			$("#infoTip").show();
		}
	});

};


//更改密码
function changePassword(){
	$("#confirmPassword").click(function(event) {
		/* Act on the event */
		var oldPassword=$("#old_password").val();
		var newpassword=$("#new_password").val();
		if(oldPassword.length<6 || newpassword.length<6){
			$("#passwordTip").html('password is too short!');
			$("#passwordTip").show();
		}
		else{
			jQuery.ajax({
			  url: '/auth/password',
			  type: 'PUT',
			  dataType: 'json',
			  data: {
			  	'old_password':oldPassword,
			  	'new_password':newpassword
			  },
			  success: function(data, textStatus, xhr) {
			  	if(data['code']==200){
			  		$("#passwordTip").html('Change Successful!');
					$("#passwordTip").show();
					setTimeout(function() {
					$("#changePassword").hide();},1000);
			  	}
			  	else{
			  		$("#passwordTip").html(data['content']);
					$("#passwordTip").show();
			  	}
			  },
			  error: function(xhr, textStatus, errorThrown) {
			  	alert(errorThrown);
			    $("#passwordTip").html('Network Error!');
				$("#passwordTip").show();
			  }
			});
			
		}
	});
};
$(window).load(function() {
	var options =
	{
		thumbBox: '.thumbBox',
		spinner: '.spinner',
		imgSrc: ''
	}
	var cropper = $('.imageBox').cropbox(options);
	var img="";
	$('#upload-file').on('change', function(){
		var reader = new FileReader();
		reader.onload = function(e) {
			options.imgSrc = e.target.result;
			cropper = $('.imageBox').cropbox(options);
			getImg();
		}
		reader.readAsDataURL(this.files[0]);
		this.files = [];
		//getImg();
	})
	$('#btnCrop').on('click', function(){
		alert("图片上传喽");
	})
	function getImg(){
		img = cropper.getDataURL();
		$('.cropped').html('');
		$('.cropped').append('<img src="'+img+'" align="absmiddle" style="width:180px;margin-top:4px;border-radius:180px;box-shadow:0px 0px 12px #7E7E7E;"><p>180px*180px</p>');
		$('.cropped').append('<img src="'+img+'" align="absmiddle" style="width:128px;margin-top:4px;border-radius:128px;box-shadow:0px 0px 12px #7E7E7E;"><p>128px*128px</p>');
		$('.cropped').append('<img src="'+img+'" align="absmiddle" style="width:64px;margin-top:4px;border-radius:64px;box-shadow:0px 0px 12px #7E7E7E;" ><p>64px*64px</p>');
		}
		
	$(".imageBox").on("mouseup",function(){
 		getImg();
  		});
		
		
	$('#btnZoomIn').on('click', function(){
		cropper.zoomIn();
	})
	$('#btnZoomOut').on('click', function(){
		cropper.zoomOut();
	})
});
