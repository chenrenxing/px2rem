/**
 * [基于zepto的移动端弹出窗口插件]
 * @laike
 * @DateTime  2015-03-16T16:39:41+0800
 * @param     {[type]}                 $ [description]
 * @return    {[type]}                   [description]
 */
(function($){
    //队列
    var queue = [];
    //默认配置
    var defaults = {
        id:'', //指定窗口ID
        formId:null,//表单id
        title:'提示',//默认标题文字
        message:'',//提示信息
        cancel:'取消',//取消按钮文字
        onCancel:function(){},//当点击取消按钮后触发的回调函数
        ok:'确认',//默认的确认按钮文字 可以改成任何文字
        onOk:function(){},//当点击确认后触发的回调函数
        cancelOnly:false,//是否只显示取消按钮
        okClass:'button',//默认确认按钮的样式
        cancelClass:'button',//默认取消按钮的样式
        onShow:function(){},//当窗口显示的时候触发的回调函数
        onHide:function(){},//当窗口隐藏的时候出发的回调函数
        closeOnOk:true,//是不是当点击确定后自动关闭弹出窗口
        hideTitle:false, //是否默认隐藏标题
        popClass:'' //覆盖样式
    };
    var Popup = (function(){

            var Popup = function(containerEl,opts){
                  this.container = containerEl;
                  if(!this.container){
                    this.container = document.body;
                  }
                  try{
                     if(typeof opts === 'string' || typeof opts === 'number'){
                        opts = {
                            message:opts,
                            cancelOnly:true,
                            cancel:'关闭',
                            hideTitle:true
                        };
                     }
                     var _this = this;
                     //拓展参数
                     var opts = $.extend({},defaults,opts);
                     if(!opts.title){
                        opts.hideTitle =true;
                     }
                     if(!opts.id){
                        opts.id = 'ycd-popup-'+Math.floor(Math.random()*10000);
                     }
                     for(var k in opts){
                        _this[k] = opts[k];
                     }
                     queue.push(this);
                     if(queue.length === 1){
                           this.show();
                     }
                  }catch(e){
                    console.log('配置错误：'+e);
                  }
            };
            Popup.prototype = {
                show:function(){
                    var _this = this;
                    var markup = '<div id='+this.id+' class="car-popup hidden '+this.popClass+'">';
                    if(!_this.hideTitle){
                        markup += '<header>'+ this.title +'</header>';
                    }
                    markup += '<div class="content-body">'+this.message+'</div>'+
                              '<footer style="clear:both;">'+
                                   '<a href="javascript:void(0);" class="car-popup-cancel '+this.cancelClass+'">'+this.cancel+'</a>'+
                                   '<a href="javascript:void(0);" class="car-popup-ok '+this.okClass+'">'+this.ok+'</a>'+
                              '</footer>'+
                              '</div></div>';
                    $(this.container).append($(markup));
                    //添加外部表单
                    if(this.formId){
                        var $content = $(this.container).find('.content-body');
                        var $form = $('#'+this.formId);
                        this.$formParent=$form.parent();
                        $form.appendTo($content);
                    }

                    var $wrap = $('#'+this.id);
                    $wrap.bind('close',function(){
                        _this.hide();
                    });

                    if(this.cancelOnly){
                        $wrap.find('.car-popup-ok').hide();
                        $wrap.find('.car-popup-cancel').addClass('center');
                    }
                    $wrap.find('A').each(function(){
                         var button = $(this);
                         button.bind('click',function(e){
                             if(button.hasClass('car-popup-ok')){
                                  _this.onOk.call(_this.onOk,_this);
                                  if(_this.closeOnOk){
                                    _this.hide();
                                  }
                             }else if(button.hasClass('car-popup-cancel')){
                                  _this.onCancel.call(_this.onCancel,_this);
                                  _this.hide();
                             }
                             e.preventDefault();
                         });
                    });

                    //重新对窗口进行定位
                    _this.positionPopup();
                    //显示遮罩
                    Mask.show(0.3);
                    //绑定当时移动端进行横屏操作时候触发的事件 对窗口进行重新定位
                    $wrap.bind('orientationchange',function(){
                        _this.positionPopup();
                    });
                    $wrap.find('header').show();
                    $wrap.find('footer').show();
                    setTimeout(function(){
                        $wrap.removeClass('hidden');
                        _this.onShow.call(_this.onShow,_this);
                    },50);

                },
                hide:function(){
                    //隐藏弹出窗口
                    var _this = this;
                    $('#'+_this.id).addClass('hidden');
                    Mask.hide();
                    //如果不是ie 或者 安卓浏览器那么就是ios 的Safari 浏览器
                    if(!$.os.ie && $.os.android){
                       setTimeout(function(){
                           _this.remove();
                       },250)
                    }else{
                        _this.remove();
                    }
                },
                remove:function(){
                    var _this = this;
                    if(_this.onHide){
                        _this.onHide.call(_this.onHide,_this);
                    }
                    var $wrap = $('#'+_this.id);
                    if(_this.formId){
                        var $form = $('#'+_this.formId);
                        $form.appendTo(_this.$formParent);

                    }
                    $wrap.unbind('close');
                    $wrap.find('.car-popup-ok').unbind('click');
                    $wrap.find('car-popup-cancel').unbind('click');
                    $wrap.unbind('orientationchange').remove();
                    queue.splice(0,1);
                    if(queue.length >0){
                        queue[0].show();
                    }
                },
                positionPopup:function(){
                          /*
                          var _this = this;
                          var $wrap = $('#'+_this.id);
                          var w0= $(window).width() || 360,
                              h0 = $(window).height() || 500,
                              w1= $wrap[0].clientWidth || 300,
                              h1=$wrap[0].clientHeight || 100;
                              $wrap.css('top',((h0/2.5)+window.pageYOffset)-(h1/2)+'px')
                              .css('left',((w0/2)-(w1/2))+'px');*/

                }
            };
            return Popup;

    })();
    //遮罩类单例
    var Mask = {
        isShow:false,
        show:function(opacity){
           if(this.isShow) return;
           opacity = opacity ? ' style="opacity:'+opacity+';"' : '';
           $('body').prepend('<div id="car-pop-mask"'+opacity+'></div>');
           $('#car-pop-mask').bind('touchstart',function(e){
               e.preventDefault();
           }).bind('touchmove',function(e){
               e.preventDefault();
           });
           this.isShow = true;
        },
        hide:function(){
            this.isShow = false;
            $('#car-pop-mask').unbind('touchstart').unbind('touchmove').remove();
        }
    };
    //和jquery插件一样添加到fn
    $.fn.popup = function(opts){
            return new Popup(this[0],opts);
    };
})(Zepto);