(() => {
 const ar=document.documentElement.lang.startsWith('ar');
 const english={
  chapters:['The arrival','The threshold','The grand hall','The sanctuary','The ritual','The detail','The perspective'],
  motionReduced:'Reduce motion',motionFull:'Full experience',
  bedDescription:'A softer rhythm. Sculpted forms, quiet textures, and space to simply be.',
  lampDescription:'A warm glow, held in a sculptural form. Light that softens the edges of the day.',
  bedNote:'Form made for stillness.',lampNote:'A quieter kind of brilliance.',
  focusBasin:'Focus on the basin',wholeRoom:'View without blur',
  scroll:'Scroll to discover',continue:'Continue the journey',menuOpen:'Open chapters',menuClose:'Close chapters'
 };
 const arabic={
  chapters:['الوصول','العبور','البهو الكبير','الملاذ','تفاصيل يومية','اللمسة','المشهد الكامل'],
  motionReduced:'تقليل الحركة',motionFull:'تشغيل الحركة',
  bedDescription:'إيقاع أهدأ. تكوينات منحوتة، وملامس هادئة، ومساحة تستعيد فيها سكينتك.',
  lampDescription:'وهج دافئ يحتضنه تكوين نحتي. إضاءة تمنح نهاية اليوم هدوءها.',
  bedNote:'تكوين يمنح السكون شكله.',lampNote:'حضور مضيء، بهدوء.',
  focusBasin:'التركيز على المغسلة',wholeRoom:'عرض دون تمويه',
  scroll:'مرّر لتكتشف',continue:'واصل الرحلة',menuOpen:'افتح فهرس الرحلة',menuClose:'أغلق فهرس الرحلة'
 };
 if(document.body.classList.contains('editorial')) {
  Object.assign(english,{bedDescription:'A low bed, soft fabric, and clear space to move around it.',lampDescription:'A broad ivory-coloured shade on a brass-toned base, placed beside the bed for a lower pool of light.',bedNote:'Low profile. Visible texture.',lampNote:'Ivory shade. Brass tone.'});
  Object.assign(arabic,{bedDescription:'سرير منخفض وأقمشة ناعمة، مع مساحة مفتوحة للحركة حوله.',lampDescription:'غطاء عريض بلون عاجي فوق قاعدة بلون النحاس، بجوار السرير وعلى ارتفاع منخفض.',bedNote:'سرير منخفض ونسيج واضح.',lampNote:'غطاء عاجي وقاعدة بلون النحاس.'});
 }
 window.ElveraText=Object.freeze({...ar?arabic:english,ar,number:n=>ar?String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d]):String(n),percent:n=>ar?String(n).replace(/\d/g,d=>'٠١٢٣٤٥٦٧٨٩'[d])+'٪':n+'%'});
})();
