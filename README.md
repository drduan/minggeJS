# minggeJS
<HEAD

 English version is [here](README_en.md).
#  MingGeJS1.8.0 寄语：

   从1.6一直到1.8.0，基本每天都在修BUG，修BUG！升级，升级！ 
            每次当我认为完美时，总是有意无意地触犯了一些低级错误！例如 我把apply居然写成aply，然后又有人喷：你连apply都不会吗？
            我说是手误，你说我装逼！面对这种人恶意攻击身心好疲劳！ 我深深体会到，要把一个类库做得近乎完美，一定要付出很多努力！
            而有的人则说这样的类库，我能做十个八个。我只是知道JQUERY作者，为了JQUERY同样地付出很多努力，在开发的前几年，作者几乎每天都是在修              BUG。

   更有甚者，说我抄袭JQUERY的源代码！直接理直气壮地埋没我这半个多月的努力！
           例如这句：
            match = /(webkit)[ \/]([\w.]+)/.exec(ua) || /(opera)(?:.*version)?[ \/]([\w.]+)/.exec(ua) || /(msie) ([\w.]+)/.exec(ua) ||                 !/compatible/.test(ua) && /(mozilla)(?:.*? rv:([\w.]+))?/.exec(ua) || [];
           navigator.userAgent是已知的，上面是正则配对，
           你认为我不抄袭JQUERY这句，我就写不出来了，这个正则很高技术含量？ /(webkit)[ \/]([\w.]+)/.exec(ua) 
           选择器的正则我都敲到出来，你认为这种1+1=2的东西对我有难度?！
           某些时候我为了节省时间，抄袭一两句（简单语句）！
           但是总被别人借题发挥，污蔑我!
           本人作为minggeJS原创作者，我问心无愧地对大家最强调一次，minggeJS 99.9%的代码都是原创敲写，0.1%是贪方便抄一两句
           minggeJS代码量一共1800行，每天修BUG和升级很辛苦的，而且做这种类库， 没有任何收入！ 你不喜欢minggeJS，你可以不看不评论，你认为你能                力比我高的，你可以放在心头，你没必要出来跟我拼，我很希望大家尊重原创作者！
               
           

MingGeJS1.8.0升级细节
：
          MingGeJS1.8.0根据GITHUB贡献者的反馈，作了大幅度调整及修复!
          1：重新调整及修复绑定事件机制：
                  示例(以click事件为例，所有事件都齐全的，别以为只有click哦)：
```
    $(xxx).bind("click",function); 绑定点击事件！
    $(xxx).bind({"click":function});OBJECT形式传入事件！
    $(xxx).unbind("click",function)解绑该事件与对应函数的绑定
    $(xxx).unbind("click"）; 解绑点击事件的所有绑定
    $(xxx).unbind(function)）;解绑该函数的所有事件
    $(xxx).one(xxxxxxxx) 与bind用法相同，不同的是，只运行一次就解开绑定
    $(xxx).click(function)   
    $(xxx).bind("click",function);的简写形式
    $(xxx).click（）让事件冒泡！
```

    on方法与off一样可以用，但没事件委托功能，event只作了简单处理！event下次升级重新定义过才写委托功能吧 

          2：新增mouseenter  mouseleave  事件，新增clientHeight      scrollWidth     scrollHeight      scrollLeft    scrollTop
             兼容IE678 及以尘世间所有浏览器！

          3：$.toJSON修复，对16位字符作了严格处理！该函数连续修了四次，都一直反馈BUG，这次应该完美了！
              另外说一下stringify插件stringify（｛"a":document｝）在浏览器下直接报错    minggeJS的toJSON则能完美通过 
              请测试      alert($.toJSON({"  \u0000a%s'\n我好122\n\u00ad\u0000 \u0000  \d\f\t\b\g\q ":"a%s'\n\n你222好\d\f\t\b\g\q\u0000\u00ad",b:{a:{b:"b"}}}));
        

         4:   JSONP 先前的机制有严重问题，已全部重写 请测试 $.getJSON("http://xxxx?callback=?",function(v){alert(v)});});


         5： 还有addClass removclass..以及大部份内部方法....等等，也作了调整及优化！


        
 
         结语：minggeJS并不单单山寨JQUERY，更多的是融入我自己思想。minggeJS的CSS3动画做得不错的，比ZEPTO动画要好是肯定的，
　　　　　　　　例如串联动画，zepto是没有的，所以minggeJS非常合适合来做手机端，做各种复杂的ＣＳＳ３动画，
                另外minggeJS支持模块及插件形式分离开发，大致用法基本和JQUERY一致，有部份函数用法则有所稍略
                请大家看DEMO.html演试！（DEMO.html已大幅度更新）

                我是mingge,请支持国产MingGeJs



------------
继优秀作品shearphoto截图插件，本人又再推出国产山寨JQUERY，为什么我要开发一个山寨JQUERY？老实说我从来没用过JQUERY，正因为我反感JQUERY。
为什么我反感，因为我完全有开发JQUERY的能力，JQUERY的底层我都了如指掌。
我开发插件一直都是用原生JS，大家可以看下我前面的作品shearphoto就是用原生JS写的。  虽说我反感JQUERY，但是JQUERY却在前端界占有大量的用户份额，之后我有个想法，不如重新开发一个属于自己思想，自己架构的JQUERY。有了想法就要实现我山寨JQUERY之路
=======
继优秀作品shearphoto截图插件，本人又再推出国产山寨jQuery，为什么我要开发一个山寨jQuery？老实说我从来没用过jQuery，正因为我反感jQuery。
为什么我反感，因为我完全有开发jQuery的能力，jQuery的底层我都了如指掌。
我开发插件一直都是用原生JS，大家可以看下我前面的作品shearphoto就是用原生JS写的。  虽说我反感jQuery，但是jQuery却在前端界占有大量的用户份额，之后我有个想法，不如重新开发一个属于自己思想，自己架构的jQuery。有了想法就要实现我山寨jQuery之路
>>>>>>> pr/60

我给了他一个霸气的名字：MingGeJs，  

MingGeJs是什么？它是我一个星期完成的作品，它是一个JS类库，它拥有和jQuery相同的语法，相同函数，相同的函数用法， 但是动画，选择器性能，函数
效率都在JQ之上，同时兼容IE 6 7 8，同时与jQuery相兼容

它的名字叫MingGeJs，MingGe就是我的大名， 一看到插件名字，就知道作者是我，知道它是国产的，让别人知道国产类库一样做得很出色，出众

本人文化程度不高，初中毕业！半句英文都不会，但是我相信只要肯努力一样可以实现自己的梦想。MingGeJS的梦想有点大胆，就是在全球范围内，占据

jQuery百分之50以上的用户份额。MingGeJs已在GIT开源，欢迎各路前端高手对MingGeJs类库进行评测！  

我是mingge    请支持国产minggeJS类库，因为我们都是中国人。    

下面我介绍一下minggeJS几大优点。

minggeJS具有以下优点
1：选择器执行速度胜出jQuery，
   以十万个DIV节点测试，分别用minggeJS与jQuery选择器取出指定节点测试：
 jQuery结果 ：     IE7以上：花时1800毫秒   IE7 花时   8135毫秒     IE6   花时超过30-40秒之间，浏览器随机卡死。
 minggeJS结果：    IE7以上：花时1500毫秒   IE7花时    5132毫秒      IE6花时 23-35秒之间   浏览器也有卡死现象，但次数少。
  花时越少，选择器性能越强，从结果来看，minggeJS大获全胜。    司徒正美也开发了一个号称世界最快的选择器，我也测试了下，从结果来看和我不分上下的！
  还有一点值得提提，居闻jQuery的选择器不是自己公司原创的，是用第三方选择器改出来的！minggeJS的选择器问心无愧地说全部是我原创开发的   
2：众所周之，JQUERY的动画原理是采用定时器方原理，minggeJS原理不同，minggeJS的动画采用的是CSS3过渡原理，遗憾的是minggeJS的动画不支持IE678。 minggeJS并不是第一个采用CSS3过渡动画，zepto的动画也是采用这个原理，可惜zepto动画做得真心差，zepto是不支持串联式动画的，用zepto做复杂动画，简直是一大败笔。   minggeJS则支持动画串联，支持高效准确回调，支持接口查询是否正在动画等，可以告诉大家用minggeJS做手机动画，绝对是最佳的选择！      
3：语法，函数用法，函数名称，都与JQUERY一致，只要会JQUERY，你就会更用minggeJS,易学易用，马上上手。部份函数用法稍有不同，例如mingge新建节点是用$(XX).createNode(),比JQUERY方便很多！
  minggeJS不单单是山寨JQUERY，更多的是融入了自己的思想，想法！
4：文件体积20K左右，后期升级可能会维持在40K左右，我自己的想法就是希望不超过40K。
5： minggeJS后期的发展，更多是想往手机端发展，即使战不胜JQUERY，能战胜zepto也是赏心悦目的事。再者就是动画方面，打算采用两种模式供用户选择，1种是CSS3，第2种CSS2定时器方式，定时器方式，估计以插件方式发布！
