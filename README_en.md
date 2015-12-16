# minggeJS

It is great honor for me to show you my brand new C2C jQuery
competitor following the tremendous success of shearphoto, my awesome
image cropping plugin. Frankly speaking, I had never used jQuery in my
work. I know jQuery from inside out, but I don't really like it. All
my plugins are developed with Vanilla JS. For example, shearphoto, my
recent work I mentioned earlier, if you look under the hood, you will
find out that it's just Vanilla JS. Up to now, there still are quite
many frontend developers suffering from jQuery, since not everyone has
the ability to build a competitive jQuery replacement. So I have an
idea, why not just write an awesome jQuery replacement with my own
thoughts and my own architecture?

My name is MingGe, which is also a fucking gangster's name in China. I
named the new library MingGeJs. Thus, you will know me is the author
as soon as you see the name, which will also remind you that, JS
libraries developed by us Chinese could be excellent and outstanding.

It took me one week to develop MingGeJs, which is intended to be
bug-for-bug compatible with jQuery, but outperforms jQuery at every
single benchmark, and with support for IE 6/7/8 as jQuery before 2.0.

I do not have a formal CS degree. I have only high school diploma. My
English is so poor that I cannot wrote even a single sentence. But, I
believe, where there is a will, there is a way. I have set an
ambitious goal for MingGeJs, that is, MingGeJs should take over more
than a half of jQuery's market share world-wide. MingGeJs has been
open sourced at Github. Feel free to open an issue, and all pull
requests are welcomed.

My name is MingGe. I speak for myself. Please support MingGeJs, for it
is a JS library by Chinese, and we are all Chinese.


# minggeJS 1.7 released

Thanks to all the contributors who have reported bugs on
Github. minggeJS 1.6 was released in a hurry, it has way too many
bugs. Most of them are fixed this time. I also have added a few APIs,
like JSONP, and attr(). Feel free to report bugs you have found, so I
could fix them as soon as possible.

In the previous release, I forgot to mention the advantages of
minggeJS, and it was mostly criticized for reinventing the wheel. I
will keep the promise that minggeJS will take over more than a half of
jQuery's market share. I have also started working on an AngularJS
replacement, which will be open sourced in the future. I really enjoy
taking great challenges.

minggeJS have several advantages over jQuery,

## 1. minggeJS's selector is faster

benchmark result of selecting specific nodes from 100K div nodes.

|            |  IE 8+   |   IE 7   |   IE 6   |
| ---------- | -------- | -------- | -------- |
|  jQuery    |  1800ms  |  8135ms  |  30-40s  |
|  minggeJS  |  1500ms  |  5132ms  |  23-35s  |

less is better.

As you can see, minggeJS is faster than jQuery on all versions of
Internet Explorer, and is comparable to a selector library by
RubyLouvre, which he claims is fastest in the world. It is worth
mentioning that, selector in minggeJS is developed on my own, while
jQuery just piggyback on a third-party library.

## 2. minggeJS has better animate()

Unlike jQuery, minggeJS's animate() is implemented using CSS3
animation. Unfortunately, IE 6/7/8 is not supported by this
release. Unlike Zepto which also uses CSS3 animation, you can easily
combine multiple animations with minggeJS. As far as I can tell,
minggeJS is the best choice to develop your next animation on mobile
phones.

## 3. minggeJS's API is just the same as jQuery

Anyone who knows jQuery will feel at home. However, minggeJS is much
more than simply a jQuery replacement, I have extended it with my very
own thoughts.

## 4. minggeJS is smaller in size.

The size of minggeJS is just 20 kB, while the size of jQuery is over
250kB. I will try my best to keep it under 40 kB in the long run.

## 5. minggeJS is mobile first

In the near future, minggeJS will first surpass zepto on mobile. And
then, minggeJS will introduce second implementation of animate(),
which uses timer, along with current one which uses CSS3
animation. You may choose one that better fits your needs.
