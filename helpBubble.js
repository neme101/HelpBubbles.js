/*
MIT License 

Copyright (c) 2011 - Juan Andrés Peón <juan.peon@replayful.com> - Máximo Gómez <maximo.gomez@replayful.com>

Permission is hereby granted, free of charge, to any
person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the
Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice
shall be included in all copies or substantial portions of
the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY
KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE
WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR
PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS
OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR
OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

*/
(function(global, $){
    HelpBubble = new Class({
        Implements: [Options, Events],

        options: {
//            anchorOrder: 'data-anchor-order',
            anchorTitle: 'data-anchor-title',
            anchorText: 'data-anchor-text',
            popupContainerClass: 'Bubble',
            popupContainerId: 'BubbleId',
            popupClassTop: 'Btop',
            popupClassBottom: 'Bbottom',
            popupClassLeft: 'Bleft',
            popupClassRight: 'Bright',
            popupClassClose: 'Bclose',
            popupCloseText: 'X',
            popupClassContent: 'Bcontent',
            popupClassTip: 'Btip',
            triggerClass: 'triggerHelp',
            hasNavigation: true,
            navigationWrapperClass: 'Boptions',
            nextTriggerId: 'help-trigger-next',
            nextTriggerText: 'Next',
            nextTriggerClass: 'Bnext',
            prevTriggerId: 'help-trigger-prev',
            prevTriggerText: 'Prev',
            prevTriggerClass: 'Bprev',
            titleAttribute: 'strong',
            titleClass: 'Btitle',
            textAttribute: 'p',
            textClass: 'Btext',
            leftMargin: 200,
            rightMargin: 200,
            topMargin: 450,
            bottomMargin: 400,
            offset: 10
        },
        
        initialize: function(options) {
            this.setOptions(options);
            this.anchors = this.fetchAnchors();
            
            this.buildPopup();
            this.current = 0;
            var show = this.show.create({
              bind: this,
              delay: 10
            });
            $$('.'+this.options.triggerClass).each(function(el){
              el.addEvent('click',function(){
                show();
              });
            });
            
            this.popupMove = new Fx.Move(this.popup);
        },
        
        fetchAnchors: function() {
            return $$('*['+this.options.anchorText+']');
            this.fireEvent('fetchAnchors');
        },
        
        buildPopup: function() {

           var helpPopupContainer = new Element('div',{
              'class': this.options.popupContainerClass,
              'id': this.options.popupContainerId
           });
           
           var popupCloseLink = new Element('a', {
              'class': this.options.popupClassClose,
              'href': '#',
              'html': this.options.popupCloseText
           });
           var popupContent = new Element('div',{
              'class': this.options.popupClassContent
           });
                      
           var popupContentTitle = new Element(this.options.titleAttribute,{
             'class': this.options.titleClass
           });
           var popupContentText = new Element(this.options.textAttribute,{
             'class': this.options.textClass
           });

           this.popupContentTitle = popupContentTitle;
           this.popupContentText = popupContentText;

           popupContent.adopt(popupContentTitle,popupContentText);

           var popupTip = new Element('span',{
              'class': this.options.popupClassTip 
           });

           var close = this.close.create({
              bind: this,
              delay: 10
            });

            popupCloseLink.addEvent('click', function(){
              close(); 
           });

           helpPopupContainer.adopt(popupCloseLink,popupContent,popupTip);

           if(this.options.hasNavigation) {
            var popupNavigation = new Element('div',{
              'class': this.options.navigationWrapperClass
            });
            var popupNextLink = new Element('a',{
              'class': this.options.nextTriggerClass,
              'href': '#',
              'html': this.options.nextTriggerText
            });
            var popupPrevLink = new Element('a',{
              'class': this.options.prevTriggerClass,
              'href': '#',
              'html': this.options.prevTriggerText
            });

            var next = this.next.create({
              bind: this,
              delay: 10
            });

            var previous = this.previous.create({
              bind: this,
              delay: 10
            });


            popupNextLink.addEvent('click',function(){
              next();
            });
            popupPrevLink.addEvent('click',function(){
              previous();
            });
            popupNavigation.adopt(popupPrevLink,popupNextLink,new Element('br',{'class': 'Bfix'}));
            helpPopupContainer.adopt(popupNavigation);
           }

           this.popup = helpPopupContainer;

           this.fireEvent('buildPopup');

        },
        
        positionPopup: function() {
          this.popup.removeClass(this.options.popupClassTop);
          this.popup.removeClass(this.options.popupClassBottom);
          this.popup.removeClass(this.options.popupClassLeft);
          this.popup.removeClass(this.options.popupClassRight);
          var documentSize = document.getSize();

          var currentAnchor = this.anchors[this.current];
          var anchorPosition = currentAnchor.getPosition();
          var anchorSize = currentAnchor.getSize();
          
          var anchorLeft = anchorPosition.x;
          var anchorTop = anchorPosition.y;
          var anchorRight = anchorPosition.x+anchorSize.x;
          var anchorBottom = anchorPosition.y+anchorSize.y;

          var targetPosition = 'top center';
          var popupPosition = 'bottom center';
          var tipClass = 'Btop';
          var offset = {x: 0, y: this.options.offset};

          if(anchorRight < this.options.leftMargin) {
              targetPosition = 'right center';
              popupPosition = 'left center';
              offset = {x: this.options.offset, y: 0};
              tipClass = 'Bleft';
          } else if (anchorLeft > documentSize.x-this.options.rightMargin) {
            targetPosition = 'left center';
            popupPosition = 'right center';
            offset = {x: this.options.offset, y: 0};
            tipClass = 'Bright';
          } else {
            if(anchorPosition.y < this.options.topMargin) {
              targetPosition = 'bottom center';
              popupPosition = 'top center';
              offset = {x: 0, y: this.options.offset};
              tipClass = 'Bbottom';
            } else {
              
            }
          }
          this.popup.addClass(tipClass);
          
          this.popupMove.start({
            'relativeTo': currentAnchor,
            'position': targetPosition,
            'edge': popupPosition,
            'offset': {'x': 10, 'y': 10},
            'returnPos': true
          });
          this.fireEvent('positionPopup');

        },

        populatePopup: function() {
          this.popupContentTitle.set('html','');
          this.popupContentText.set('html','');
          this.popupContentTitle.set('html',this.anchors[this.current].get(this.options.anchorTitle));
          this.popupContentText.set('html',this.anchors[this.current].get(this.options.anchorText));
          this.fireEvent('populatePopup');

        },

        close: function() {
            this.popup = this.popup.dispose(this.popup);
            this.fireEvent('close');

        },

        show: function() {
          this.populatePopup();
          
          if(!$(this.options.popupContainerId)) this.popup.inject(document.body,'bottom');
          this.positionPopup();
          this.fireEvent('show');

        }, 

        next: function() {
            if(this.anchors.length>1) {
              if(this.current == (this.anchors.length - 1)) {
                this.current = 0;
              } else {
                this.current += 1;
              }
              this.populatePopup();
              this.show();
            }
            this.fireEvent('next');

        },

        previous: function () {
            if(this.anchors.length>1) {
              if(this.current == 0) {
                this.current = this.anchors.length - 1;
              } else {
                this.current -= 1;
              }
              this.populatePopup();
              this.show();
            }
            this.fireEvent('previous');

        }
    });
    
})(this, document.id || $);