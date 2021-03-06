//窗口resize时自适应
function winResize(){
  var length = $('.chart').length
  var winHeight = $(window).height()
  var winWidth = $(window).width()
  $('.row').css({'height':winHeight,'width':winWidth})

  if(0<length && length<2){
    $('.chart').each(function(){
      $(this).addClass('col-xs-12 col-sm-12')
      $(this).css('height',winHeight)
    })
      
  }else if(1< length && length<3){
    $('.chart').each(function(){
      $(this).addClass('col-xs-6 col-sm-6')
      $(this).css('height',winHeight)
    })
      
  }else if(2<length && length<4){
    $('.chart').each(function(){
      $(this).addClass('col-xs-4 col-sm-4')
      $(this).css('height',winHeight)
    })  
  }else if(3<length  && length<4){
    $('.chart').each(function(){
      $(this).addClass('col-xs-6 col-sm-6')
      $(this).css('height',winHeight/2)
    }) 
  }else if(4<length  && length<7){
    $('.chart').each(function(){
      $(this).addClass('col-xs-6 col-sm-6')
      $(this).css('height',winHeight/3)
    })  
  }else if(6<length && length<10){
    $('.chart').each(function(){
      $(this).addClass('col-xs-4 col-sm-4')
      $(this).css('height',winHeight/3)
    })  
  }
}
winResize()
$(window).resize(function(){
  winResize()
  var xx = document.getElementById("zz_0").offsetHeight
  PubSub.publish('Resize', xx);

})
//交互操作
$("body").on('mouseover','.chart',function(){
  $(this).find('.search').css('display','block')
})
$("body").on('mouseout','.chart',function(){
  $(this).find('.search').css('display','none')
  $(this).find('.autocomplete-input').val('')
  $(this).find('.proposal-list').empty()
})
$('body').on('click','.chart',function(){
  $(this).find('.search input').focus()
})
$('.control').hover(function(){
  $(this).css('opacity','1')
},function(){
  $(this).css('opacity','0')
})
