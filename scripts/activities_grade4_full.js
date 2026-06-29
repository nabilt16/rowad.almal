// ACTIVITIES GRADE 4 - all 20 lessons
// Font minimum 16px, text color rgba(255,255,255,0.88)+, dark backgrounds with borders

// SHARED STYLES
var ACT_BTN = 'text-align:right;padding:12px 16px;color:rgba(255,255,255,0.92);font-size:16px;font-family:Noto Naskh Arabic,serif;background:rgba(255,255,255,0.08);border:1.5px solid rgba(255,255,255,0.2);border-radius:12px;width:100%;display:block;cursor:pointer;margin-bottom:4px;';
var ACT_BOX = 'background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:14px;padding:16px;margin-bottom:14px;font-size:16px;line-height:1.9;color:rgba(255,255,255,0.88);';
var ACT_YELLOW_BOX = 'background:rgba(255,193,7,0.1);border:1px solid rgba(255,193,7,0.3);border-radius:14px;padding:16px;margin-bottom:14px;font-size:16px;line-height:1.9;color:rgba(255,255,255,0.88);';
var ACT_GREEN_FB = 'display:block;background:rgba(102,187,106,0.15);border:1.5px solid #66BB6A;color:#81C784;border-radius:12px;padding:12px;margin-top:10px;font-size:16px;line-height:1.7';
var ACT_RED_FB = 'display:block;background:rgba(239,83,80,0.1);border:1.5px solid #EF5350;color:#EF9A9A;border-radius:12px;padding:12px;margin-top:10px;font-size:16px;line-height:1.7';

function _actBtn(text, onclick) {
  return '<button style="'+ACT_BTN+'" onclick="'+onclick+'">'+text+'</button>';
}
function _actHeader(icon, title, sub) {
  return '<div class="amir-act-header"><span class="amir-act-icon">'+icon+'</span><div><div class="amir-act-title">'+title+'</div><div class="amir-act-sub">'+sub+'</div></div></div>';
}
function _stepNum(n) {
  return '<span class="amir-step-num" style="background:rgba(21,101,192,0.25);color:#42A5F5">'+n+'</span>';
}

// Generic answer handler
var _actDone = {};
function _checkAns(btnEl, correct, lid, key, goodMsg, badMsg) {
  var k = lid+'_'+key;
  if(_actDone[k]) return;
  var fb = document.getElementById('actfb-'+lid+'-'+key);
  if(correct) {
    _actDone[k] = true;
    btnEl.style.cssText += 'border-color:#66BB6A;background:rgba(102,187,106,0.15);color:#81C784;';
    if(fb) { fb.innerHTML = goodMsg; fb.style.cssText = ACT_GREEN_FB; }
    // unlock next step
    var steps = document.querySelectorAll('#act-'+lid+' .amir-step.locked');
    if(steps.length) setTimeout(function(){ steps[0].classList.replace('locked','active'); }, 700);
  } else {
    btnEl.style.cssText += 'border-color:#EF5350;background:rgba(239,83,80,0.15);color:#EF9A9A;';
    if(fb) { fb.innerHTML = badMsg; fb.style.cssText = ACT_RED_FB; }
    setTimeout(function(){
      btnEl.style.borderColor='rgba(255,255,255,0.2)';
      btnEl.style.background='rgba(255,255,255,0.08)';
      btnEl.style.color='rgba(255,255,255,0.92)';
      if(fb) fb.style.display='none';
    }, 1200);
  }
}

// ===================== L1: المقايضة =====================
function buildActivityL1(lid) {
  return '<div class="amir-activity" id="act-'+lid+'">'
    +_actHeader('🔄','فعالية: "سوق المقايضة"','ساعد خالد يحل مشكلة المقايضة')
    +'<div class="amir-step active" id="act-'+lid+'-s1">'
    +'<div class="amir-step-title">'+_stepNum(1)+' 🧩 لماذا فشل خالد؟</div>'
    +'<div style="'+ACT_YELLOW_BOX+'">💰 خالد عنده <strong style="color:#FFD54F">تفاح</strong> ويريد <strong style="color:#81C784">قميصاً</strong>.<br>أبو رامي يريد <strong style="color:#FFB74D">قمحاً</strong>، وأبو داود يريد <strong style="color:#FF8A65">جلداً</strong>.<br><br>ما المشكلة الأساسية في المقايضة؟</div>'
    +_actBtn('أ) التفاح ليس لذيذاً كفاية',"_checkAns(this,false,'"+lid+"','l1q1','','💭 لم تكن المشكلة في التفاح! فكّر في الشخص الآخر...')")
    +_actBtn('ب) يجب أن يتطابق ما يريده الطرفان في نفس الوقت',"_checkAns(this,true,'"+lid+"','l1q1','🎉 ممتاز! هذه هي مشكلة المقايضة — يجب تطابق الرغبتين في نفس الوقت وهذا صعب جداً. لذلك اخترع الناس المال!','');")
    +_actBtn('ج) خالد لم يحاول كفاية',"_checkAns(this,false,'"+lid+"','l1q1','','💭 في الحقيقة حاول خالد كثيراً! المشكلة في نظام المقايضة نفسه...')")
    +'<div id="actfb-'+lid+'-l1q1" style="display:none"></div>'
    +'</div>'
    +'<div class="amir-step locked" id="act-'+lid+'-s2">'
    +'<div class="amir-step-title">'+_stepNum(2)+' 🪙 ترتيب تطور المال</div>'
    +'<div style="font-size:16px;color:rgba(255,255,255,0.8);margin-bottom:12px">اضغط على المراحل بالترتيب الصحيح من الأقدم للأحدث:</div>'
    +'<div id="l1order-'+lid+'" style="display:flex;flex-direction:column;gap:8px">'
    +_actBtn('💳 البطاقات والهاتف',"_orderL1(this,'3','"+lid+"')")
    +_actBtn('🔄 المقايضة المباشرة',"_orderL1(this,'1','"+lid+"')")
    +_actBtn('🥇 الذهب والفضة',"_orderL1(this,'2','"+lid+"')")
    +'</div>'
    +'<div id="l1progress-'+lid+'" style="margin-top:10px;font-size:15px;color:rgba(255,255,255,0.5)">اضغط بالترتيب 1 ← 2 ← 3</div>'
    +'<div id="actfb-'+lid+'-l1order" style="display:none"></div>'
    +'</div>'
    +'</div>';
}
var _l1o={};
function _orderL1(btn,num,lid){
  if(!_l1o[lid])_l1o[lid]={next:1,done:0};
  var s=_l1o[lid];
  if(btn.dataset.done)return;
  if(parseInt(num)===s.next){
    btn.style.cssText+=';border-color:#66BB6A;background:rgba(102,187,106,0.2);color:#81C784;';
    btn.dataset.done='1';s.next++;s.done++;
    document.getElementById('l1progress-'+lid).textContent=s.done+'/3 صحيح!';
    if(s.done===3){var fb=document.getElementById('actfb-'+lid+'-l1order');fb.innerHTML='🎉 ممتاز! الترتيب: مقايضة ← ذهب ← بطاقات. هكذا تطوّر المال عبر التاريخ!';fb.style.cssText=ACT_GREEN_FB;}
  } else {
    btn.style.cssText+=';border-color:#EF5350;background:rgba(239,83,80,0.15);';
    setTimeout(function(){btn.style.borderColor='rgba(255,255,255,0.2)';btn.style.background='rgba(255,255,255,0.08)';btn.style.color='rgba(255,255,255,0.92)';},800);
  }
}

// ===================== L2: الشيكل =====================
function buildActivityL2(lid) {
  return '<div class="amir-activity" id="act-'+lid+'">'
    +_actHeader('🪙','فعالية: "ياسمين في البوفيه"','احسب كم سيبقى معها بعد الشراء')
    +'<div class="amir-step active" id="act-'+lid+'-s1">'
    +'<div class="amir-step-title">'+_stepNum(1)+' 🧮 كم يبقى معها؟</div>'
    +'<div style="'+ACT_YELLOW_BOX+'">💰 مع ياسمين <strong style="color:#FFD54F">20 ₪</strong><br>🥪 ساندويتش = <strong style="color:#FF8A65">8 ₪</strong><br>🧃 عصير = <strong style="color:#FF8A65">7 ₪</strong><br><br><strong>كم سيبقى معها للتوفير؟</strong></div>'
    +_actBtn('أ) 3 ₪',"_checkAns(this,false,'"+lid+"','l2q1','','💭 حساب: 8+7=15، و20-15=؟ ليس 3...')")
    +_actBtn('ب) 5 ₪',"_checkAns(this,true,'"+lid+"','l2q1','🎉 صحيح! 8+7=15، و20-15=5 ₪. ياسمين ذكية — وفّرت 5 ₪ لحصالتها!','')")
    +_actBtn('ج) 10 ₪',"_checkAns(this,false,'"+lid+"','l2q1','','💭 حساب: 8+7=15، و20-15=؟ ليس 10...')")
    +'<div id="actfb-'+lid+'-l2q1" style="display:none"></div>'
    +'</div>'
    +'<div class="amir-step locked" id="act-'+lid+'-s2">'
    +'<div class="amir-step-title">'+_stepNum(2)+' 💡 صواب أم خطأ؟</div>'
    +'<div style="'+ACT_BOX+'">«المال الرقمي أقل قيمة من النقد الورقي»<div style="display:flex;gap:8px;margin-top:10px">'
    +'<button onclick="_tfCheck(this,true,\''+lid+'\',\'l2tf1\',\'🎉 صحيح! المال الرقمي بنفس قيمة النقد تماماً.\',\'\')" style="'+ACT_BTN+'width:auto;flex:1">❌ خطأ</button>'
    +'<button onclick="_tfCheck(this,false,\''+lid+'\',\'l2tf1\',\'\',\'💭 المال هو المال سواء ورقياً أو رقمياً!\')" style="'+ACT_BTN+'width:auto;flex:1">✅ صواب</button>'
    +'</div><div id="actfb-'+lid+'-l2tf1" style="display:none"></div></div>'
    +'<div style="'+ACT_BOX+'">«التوفير يبدأ بمبالغ صغيرة»<div style="display:flex;gap:8px;margin-top:10px">'
    +'<button onclick="_tfCheck(this,true,\''+lid+'\',\'l2tf2\',\'🎉 صحيح! حتى شيكل واحد يوفر يُحدث فرقاً مع الوقت.\',\'\')" style="'+ACT_BTN+'width:auto;flex:1">✅ صواب</button>'
    +'<button onclick="_tfCheck(this,false,\''+lid+'\',\'l2tf2\',\'\',\'💭 بالعكس! كل شيكل يحسب!\')" style="'+ACT_BTN+'width:auto;flex:1">❌ خطأ</button>'
    +'</div><div id="actfb-'+lid+'-l2tf2" style="display:none"></div></div>'
    +'</div></div>';
}
var _tfDone={};
function _tfCheck(btn,correct,lid,key,good,bad){
  if(_tfDone[lid+key])return;
  _tfDone[lid+key]=true;
  var fb=document.getElementById('actfb-'+lid+'-'+key);
  if(correct){btn.style.cssText+=';border-color:#66BB6A;background:rgba(102,187,106,0.2);color:#81C784;';if(fb){fb.innerHTML=good;fb.style.cssText=ACT_GREEN_FB;}}
  else{btn.style.cssText+=';border-color:#EF5350;background:rgba(239,83,80,0.15);color:#EF9A9A;';if(fb){fb.innerHTML=bad;fb.style.cssText=ACT_RED_FB;}}
}

// ===================== L3: طرق الدفع =====================
function buildActivityL3(lid) {
  return '<div class="amir-activity" id="act-'+lid+'">'
    +_actHeader('💳','فعالية: "أحمد في السوبر ماركت"','اختر طريقة الدفع الصحيحة لكل موقف')
    +'<div class="amir-step active" id="act-'+lid+'-s1">'
    +'<div class="amir-step-title">'+_stepNum(1)+' 📱 أحمد نسي محفظته!</div>'
    +'<div style="'+ACT_YELLOW_BOX+'">🛒 أحمد عند الصندوق — ليس معه نقود!<br>ما الحل الأسرع والأذكى؟</div>'
    +_actBtn('أ) يرجع إلى البيت ليأخذ المحفظة',"_checkAns(this,false,'"+lid+"','l3q1','','💭 هذا مستغرق وقتاً! هل عنده خيار أسرع؟')")
    +_actBtn('ب) يستخدم تطبيق Bit أو PayBox من هاتفه',"_checkAns(this,true,'"+lid+"','l3q1','🎉 ممتاز! الدفع الرقمي يحل المشكلة فوراً. تأكد دائماً من الرقم قبل الإرسال!','')")
    +_actBtn('ج) يأخذ البضاعة ويدفع لاحقاً',"_checkAns(this,false,'"+lid+"','l3q1','','💭 هذا قد يسبب مشكلة مع صاحب المتجر!')")
    +'<div id="actfb-'+lid+'-l3q1" style="display:none"></div>'
    +'</div>'
    +'<div class="amir-step locked" id="act-'+lid+'-s2">'
    +'<div class="amir-step-title">'+_stepNum(2)+' 🔗 وصّل طريقة الدفع بميزتها</div>'
    +'<div style="font-size:16px;color:rgba(255,255,255,0.8);margin-bottom:12px">اختر الميزة الأساسية لكل طريقة دفع:</div>'
    +'<div style="'+ACT_BOX+'">💵 النقد — ما ميزته الأساسية؟'
    +'<div style="display:flex;flex-direction:column;gap:6px;margin-top:10px">'
    +_actBtn('يُقبل في كل مكان',"_checkAns(this,true,'"+lid+"','l3m1','🎉 صحيح! النقد مقبول في كل مكان حتى بدون كهرباء أو إنترنت.','')")
    +_actBtn('الأسرع في الدفع',"_checkAns(this,false,'"+lid+"','l3m1','','💭 النقد ليس الأسرع دائماً — البطاقة أسرع أحياناً!')")
    +'</div><div id="actfb-'+lid+'-l3m1" style="display:none"></div></div>'
    +'<div style="'+ACT_BOX+'">📱 Bit/PayBox — ما ميزته الأساسية؟'
    +'<div style="display:flex;flex-direction:column;gap:6px;margin-top:10px">'
    +_actBtn('تحويل سريع بالهاتف بدون نقود',"_checkAns(this,true,'"+lid+"','l3m2','🎉 صحيح! Bit يتيح لك الدفع فوراً من هاتفك حتى بدون بطاقة.','')")
    +_actBtn('يُقبل في كل محل',"_checkAns(this,false,'"+lid+"','l3m2','','💭 ليس كل المحلات تقبل Bit — النقد هو الأشمل!')")
    +'</div><div id="actfb-'+lid+'-l3m2" style="display:none"></div></div>'
    +'</div></div>';
}

// ===================== L4: المال الرقمي =====================
function buildActivityL4(lid) {
  return '<div class="amir-activity" id="act-'+lid+'">'
    +_actHeader('💻','فعالية: "نادين وسر الإنفاق السهل"','اتخذ القرار الأذكى قبل الدفع الرقمي')
    +'<div class="amir-step active" id="act-'+lid+'-s1">'
    +'<div class="amir-step-title">'+_stepNum(1)+' 🤔 لماذا الدفع الرقمي أسهل؟</div>'
    +'<div style="'+ACT_YELLOW_BOX+'">نادين تلاحظ: عندما تدفع بهاتفها لا تحزن، لكن عند إخراج ورقة 50 ₪ تتردد.<br><br>ما السبب الحقيقي؟</div>'
    +_actBtn('أ) الهاتف أسرع من المحفظة',"_checkAns(this,false,'"+lid+"','l4q1','','💭 السرعة ليست السبب الحقيقي...')")
    +_actBtn('ب) لا ترى المال يذهب جسدياً عند الدفع الرقمي',"_checkAns(this,true,'"+lid+"','l4q1','🎉 ممتاز! الورقة ملموسة وتراها تذهب، أما الرقم على الشاشة فلا تشعر به بنفس الطريقة!','')")
    +_actBtn('ج) المال الرقمي أقل قيمة',"_checkAns(this,false,'"+lid+"','l4q1','','💭 المال الرقمي بنفس القيمة! السبب نفسي وليس مالياً...')")
    +'<div id="actfb-'+lid+'-l4q1" style="display:none"></div>'
    +'</div>'
    +'<div class="amir-step locked" id="act-'+lid+'-s2">'
    +'<div class="amir-step-title">'+_stepNum(2)+' ✅ القاعدة الذهبية</div>'
    +'<div style="'+ACT_BOX+'">نادين تريد شراء تطبيق بـ15 ₪ بنقرة واحدة. ماذا يجب أن تفعل أولاً؟</div>'
    +_actBtn('أ) تضغط «شراء» فوراً لأنها 15 ₪ فقط',"_checkAns(this,false,'"+lid+"','l4q2','','💭 «15 ₪ فقط» تتكرر وتصبح كثيراً! دائماً توقف وفكّر أولاً.')")
    +_actBtn('ب) تتوقف وتسأل نفسها: هل أحتاج هذا فعلاً؟',"_checkAns(this,true,'"+lid+"','l4q2','🎉 ممتاز! هذه اللحظة هي أهم لحظة في أي قرار شراء رقمي أو نقدي!','')")
    +_actBtn('ج) تسأل صديقتها رأيها',"_checkAns(this,false,'"+lid+"','l4q2','','💭 الصديقة قد تشجع الشراء! القرار يجب أن يكون قرارها هي.')")
    +'<div id="actfb-'+lid+'-l4q2" style="display:none"></div>'
    +'</div></div>';
}

// ===================== L5: حاجة أم رغبة =====================
function buildActivityL5(lid) {
  return '<div class="amir-activity" id="act-'+lid+'">'
    +_actHeader('⚖️','فعالية: "سامي وخيار صعب"','صنّف كل بند — حاجة أم رغبة؟')
    +'<div class="amir-step active" id="act-'+lid+'-s1">'
    +'<div class="amir-step-title">'+_stepNum(1)+' ⚖️ قرار سامي</div>'
    +'<div style="'+ACT_YELLOW_BOX+'">سامي معه <strong style="color:#FFD54F">25 ₪</strong>.<br>الدفتر <strong style="color:#81C784">7 ₪</strong> (المعلمة ستطلبه غداً)<br>الشيبس <strong style="color:#FF8A65">8 ₪</strong> (يحبه كثيراً)<br><br>ماذا يفعل سامي أولاً؟</div>'
    +_actBtn('أ) يشتري علبتين من الشيبس (16 ₪)',"_checkAns(this,false,'"+lid+"','l5q1','','💭 لكنه سيحتاج الدفتر غداً! الحاجات تأتي قبل الرغبات.')")
    +_actBtn('ب) يشتري الدفتر أولاً ثم يقرر بشأن الشيبس',"_checkAns(this,true,'"+lid+"','l5q1','🎉 رائع! الدفتر حاجة ضرورية للمدرسة، والشيبس رغبة. الحاجات دائماً أولاً!','')")
    +_actBtn('ج) يصرف الـ25 ₪ كلها في الدكان',"_checkAns(this,false,'"+lid+"','l5q1','','💭 إذا صرفت كل ما تملك لن تجد شيئاً للطوارئ أو الأهداف الكبيرة!')")
    +'<div id="actfb-'+lid+'-l5q1" style="display:none"></div>'
    +'</div>'
    +'<div class="amir-step locked" id="act-'+lid+'-s2">'
    +'<div class="amir-step-title">'+_stepNum(2)+' 🏷️ صنّف هذه البنود</div>'
    +'<div style="font-size:16px;color:rgba(255,255,255,0.8);margin-bottom:12px">لكل بند — هل هو حاجة أم رغبة؟</div>'
    +['🍞 خبز|حاجة|رغبة','💊 دواء للمرض|حاجة|رغبة','🍫 شوكولاتة|رغبة|حاجة','📚 كتاب مدرسي|حاجة|رغبة'].map(function(item,i){
      var p=item.split('|'); var label=p[0]; var correct=p[1]; var wrong=p[2];
      var k='l5cl'+i;
      return '<div style="'+ACT_BOX+' margin-bottom:8px">'+label+'<div style="display:flex;gap:8px;margin-top:8px">'
        +'<button onclick="_tfCheck(this,true,\''+lid+'\',\''+k+'\',\'🎉 صحيح!\',\'\')" style="'+ACT_BTN+'width:auto;flex:1">'+correct+'</button>'
        +'<button onclick="_tfCheck(this,false,\''+lid+'\',\''+k+'\',\'\',\'💭 فكّر مجدداً!\')" style="'+ACT_BTN+'width:auto;flex:1">'+wrong+'</button>'
        +'<div id="actfb-'+lid+'-'+k+'" style="display:none"></div></div></div>';
    }).join('')
    +'</div></div>';
}

// ===================== L6: الميزانية =====================
function buildActivityL6(lid) {
  return '<div class="amir-activity" id="act-'+lid+'">'
    +_actHeader('📊','فعالية: "ريم والأسبوع الأبيض"','ساعد ريم تخطط ميزانيتها')
    +'<div class="amir-step active" id="act-'+lid+'-s1">'
    +'<div class="amir-step-title">'+_stepNum(1)+' 🔢 حساب الأضرار</div>'
    +'<div style="'+ACT_YELLOW_BOX+'">ريم مصروفها <strong style="color:#FFD54F">30 ₪</strong> في الأسبوع.<br>الأحد: شيبس + عصير = <strong style="color:#FF8A65">10 ₪</strong><br>الثلاثاء: سينما = <strong style="color:#FF8A65">15 ₪</strong><br>الأربعاء: فطور = <strong style="color:#FF8A65">8 ₪</strong><br><br>كم بقي معها؟</div>'
    +_actBtn('أ) 5 ₪ موجبة',"_checkAns(this,false,'"+lid+"','l6q1','','💭 الحساب: 30-10-15-8=؟ هل النتيجة موجبة؟')")
    +_actBtn('ب) صفر — صرفت بالضبط',"_checkAns(this,false,'"+lid+"','l6q1','','💭 الحساب: 10+15+8=33، وهي تملك 30 فقط...')")
    +_actBtn('ج) ناقص 3 ₪ — أصبحت مديونة!',"_checkAns(this,true,'"+lid+"','l6q1','🎉 صحيح! 10+15+8=33، وريم تملك 30 فقط. أنفقت 3 ₪ أكثر مما تملك!','')")
    +'<div id="actfb-'+lid+'-l6q1" style="display:none"></div>'
    +'</div>'
    +'<div class="amir-step locked" id="act-'+lid+'-s2">'
    +'<div class="amir-step-title">'+_stepNum(2)+' 📋 خطة الأسبوع القادم</div>'
    +'<div style="'+ACT_BOX+'">ريم تريد تجنب الديون. ما الحل الأفضل؟</div>'
    +_actBtn('أ) تطلب مالاً إضافياً من أمها كل أسبوع',"_checkAns(this,false,'"+lid+"','l6q2','','💭 حل مؤقت! لا يعلمها إدارة المال في المستقبل.')")
    +_actBtn('ب) تقسم الـ30 ₪ على أيام الأسبوع مسبقاً',"_checkAns(this,true,'"+lid+"','l6q2','🎉 هذا هو التخطيط الصحيح! توزيع المال مسبقاً يساعدك على الصمود حتى نهاية الأسبوع.','')")
    +_actBtn('ج) لا تأكل شيئاً لتوفير المال',"_checkAns(this,false,'"+lid+"','l6q2','','💭 صحتك أهم! الهدف هو الصرف بذكاء وليس الحرمان.')")
    +'<div id="actfb-'+lid+'-l6q2" style="display:none"></div>'
    +'</div></div>';
}

// ===================== L7: التوفير =====================
function buildActivityL7(lid) {
  return '<div class="amir-activity" id="act-'+lid+'">'
    +_actHeader('🎯','فعالية: "يوسف والكتاب"','احسب كم أسبوعاً يحتاج للوصول لهدفه')
    +'<div class="amir-step active" id="act-'+lid+'-s1">'
    +'<div class="amir-step-title">'+_stepNum(1)+' 🧮 معادلة التوفير</div>'
    +'<div style="'+ACT_YELLOW_BOX+'">🎯 هدف يوسف: كتاب بـ<strong style="color:#FFD54F">55 ₪</strong><br>💰 يوفر كل أسبوع: <strong style="color:#81C784">8 ₪</strong><br><br>كم أسبوعاً يحتاج؟</div>'
    +_actBtn('أ) 5 أسابيع',"_checkAns(this,false,'"+lid+"','l7q1','','💭 5 × 8 = 40 ₪ فقط — لم يكفِ! المعادلة: 55 ÷ 8 = ؟')")
    +_actBtn('ب) 7 أسابيع',"_checkAns(this,true,'"+lid+"','l7q1','🎉 ممتاز! 7 × 8 = 56 ₪ — وصل لهدفه وزيادة! المعادلة: الهدف ÷ التوفير الأسبوعي.','')")
    +_actBtn('ج) 10 أسابيع',"_checkAns(this,false,'"+lid+"','l7q1','','💭 10 × 8 = 80 ₪ — أكثر بكثير! المعادلة: 55 ÷ 8 = 7 أسابيع تقريباً.')")
    +'<div id="actfb-'+lid+'-l7q1" style="display:none"></div>'
    +'</div>'
    +'<div class="amir-step locked" id="act-'+lid+'-s2">'
    +'<div class="amir-step-title">'+_stepNum(2)+' 📐 تحدي الحساب</div>'
    +'<div style="'+ACT_BOX+'">هدف جديد: كتاب بـ<strong style="color:#FFD54F">48 ₪</strong> — يوفر <strong style="color:#81C784">8 ₪</strong> أسبوعياً.<br>كم أسبوعاً يحتاج؟</div>'
    +_actBtn('أ) 4 أسابيع',"_checkAns(this,false,'"+lid+"','l7q2','','💭 4 × 8 = 32 ₪ — لم يكفِ! المعادلة: 48 ÷ 8 = ؟')")
    +_actBtn('ب) 6 أسابيع',"_checkAns(this,true,'"+lid+"','l7q2','🎉 ممتاز! 6 × 8 = 48 ₪. بعد ستة أسابيع يصل لهدفه بالضبط!','')")
    +_actBtn('ج) 8 أسابيع',"_checkAns(this,false,'"+lid+"','l7q2','','💭 8 × 8 = 64 ₪ — أكثر من الهدف! المعادلة: 48 ÷ 8 = 6 أسابيع.')")
    +'<div id="actfb-'+lid+'-l7q2" style="display:none"></div>'
    +'</div></div>';
}

// ===================== L7b: التبرع =====================
function buildActivityL7b(lid) {
  return '<div class="amir-activity" id="act-'+lid+'">'
    +_actHeader('🤲','فعالية: "كريم والكنزة"','اتخذ قرار كريم بحكمة')
    +'<div class="amir-step active" id="act-'+lid+'-s1">'
    +'<div class="amir-step-title">'+_stepNum(1)+' 💭 قرار كريم</div>'
    +'<div style="'+ACT_YELLOW_BOX+'">كريم وفّر <strong style="color:#FFD54F">40 ₪</strong>.<br>زميله تامر يرتجف بلا كنزة في البرد.<br>الكنزة في السوق بـ<strong style="color:#81C784">35 ₪</strong>.<br><br>ماذا يفعل كريم؟</div>'
    +_actBtn('أ) يحتفظ بماله لأنه وفّر طويلاً',"_checkAns(this,false,'"+lid+"','l7bq1','','💭 التوفير مهم، لكن هناك حاجة حقيقية أمامه الآن...')")
    +_actBtn('ب) يشتري الكنزة لتامر',"_checkAns(this,true,'"+lid+"','l7bq1','🎉 قلب كبير! كريم شعر بسعادة حقيقية بعد القرار. المال الذي تعطيه يعود إليك بشكل آخر!','')")
    +_actBtn('ج) يخبر المعلمة بدلاً من الشراء',"_checkAns(this,false,'"+lid+"','l7bq1','','💭 هذا خيار، لكن كريم يملك الحل بيده الآن!')")
    +'<div id="actfb-'+lid+'-l7bq1" style="display:none"></div>'
    +'</div>'
    +'<div class="amir-step locked" id="act-'+lid+'-s2">'
    +'<div class="amir-step-title">'+_stepNum(2)+' 🪙 تقسيم ذكي</div>'
    +'<div style="'+ACT_BOX+'">عند كريم <strong style="color:#FFD54F">20 ₪</strong> في دلو التبرع. رأى جمعية للأطفال المرضى.<br>ما القرار الأحكم؟</div>'
    +_actBtn('أ) يتبرع بكل الـ20 ₪',"_checkAns(this,false,'"+lid+"','l7bq2','','💭 التبرع بكل شيء دفعة واحدة ليس دائماً الأحكم.')")
    +_actBtn('ب) يتبرع بجزء ويحتفظ بالباقي',"_checkAns(this,true,'"+lid+"','l7bq2','🎉 قرار حكيم! حتى 5 ₪ تصنع فرقاً. التوازن بين العطاء والتوفير هو الحكمة.','')")
    +_actBtn('ج) ينقل المال إلى دلو التوفير',"_checkAns(this,false,'"+lid+"','l7bq2','','💭 دلو التبرع له غرض مختلف عن التوفير!')")
    +'<div id="actfb-'+lid+'-l7bq2" style="display:none"></div>'
    +'</div></div>';
}

// ===================== L8: الإعلانات =====================
function buildActivityL8(lid) {
  return '<div class="amir-activity" id="act-'+lid+'">'
    +_actHeader('📢','فعالية: "ليلى والإعلان المغري"','اكشف فخاخ الإعلانات')
    +'<div class="amir-step active" id="act-'+lid+'-s1">'
    +'<div class="amir-step-title">'+_stepNum(1)+' 🧐 هل هو فخ؟</div>'
    +'<div style="'+ACT_YELLOW_BOX+'">إعلان: «اشترِ الآن! العرض ينتهي الليلة فقط!»<br>ليلى لم تكن تفكر في الشراء قبل الإعلان.<br><br>ماذا يجب أن تفعل؟</div>'
    +_actBtn('أ) تشتري فوراً قبل انتهاء العرض',"_checkAns(this,false,'"+lid+"','l8q1','','💭 هذا بالضبط ما يريده الإعلان! الضغط الزمني مصطنع في أغلب الأحيان.')")
    +_actBtn('ب) تتوقف وتسأل: هل كنت أريد هذا قبل الإعلان؟',"_checkAns(this,true,'"+lid+"','l8q1','🎉 ممتاز! إذا لم تكن تريده من قبل — الإعلان هو من خلق الرغبة. هذا هو سلاحك ضد الإعلانات!','')")
    +_actBtn('ج) تتجاهل كل الإعلانات دائماً',"_checkAns(this,false,'"+lid+"','l8q1','','💭 ليس كل الإعلانات سيئة — الأهم أن تفكر قبل أن تشتري!')")
    +'<div id="actfb-'+lid+'-l8q1" style="display:none"></div>'
    +'</div>'
    +'<div class="amir-step locked" id="act-'+lid+'-s2">'
    +'<div class="amir-step-title">'+_stepNum(2)+' 🏷️ تعرّف على الفخ</div>'
    +'<div style="font-size:16px;color:rgba(255,255,255,0.8);margin-bottom:12px">صنّف كل إعلان — فخ أم مفيد؟</div>'
    +[
      ['«اشترِ 2 بسعر 1 اليوم فقط!»','فخ','مفيد','l8c1','🎉 فخ! هل تحتاج اثنتين فعلاً؟',''],
      ['«تخفيضات الموسم — 30% على المنتجات التالفة»','فخ','مفيد','l8c2','🎉 فخ! التالف بأي سعر ليس صفقة.',''],
      ['«جديد في المتجر — خضار طازج من المزرعة»','مفيد','فخ','l8c3','🎉 مفيد! هذا مجرد إعلام عن منتج حقيقي.','']
    ].map(function(item){
      return '<div style="'+ACT_BOX+' margin-bottom:8px">'+item[0]+'<div style="display:flex;gap:8px;margin-top:8px">'
        +'<button onclick="_tfCheck(this,true,\''+lid+'\',\''+item[3]+'\',\''+item[4]+'\',\''+item[5]+'\')" style="'+ACT_BTN+'width:auto;flex:1">🔴 '+item[1]+'</button>'
        +'<button onclick="_tfCheck(this,false,\''+lid+'\',\''+item[3]+'\',\'\',\'💭 فكّر مجدداً!\')" style="'+ACT_BTN+'width:auto;flex:1">🟢 '+item[2]+'</button>'
        +'<div id="actfb-'+lid+'-'+item[3]+'" style="display:none"></div></div></div>';
    }).join('')
    +'</div></div>';
}

// ===================== L9: المقارنة =====================
function buildActivityL9(lid) {
  return '<div class="amir-activity" id="act-'+lid+'">'
    +_actHeader('⚖️','فعالية: "نور وحيرة الحذاء"','تعلم تحسب القيمة الحقيقية')
    +'<div class="amir-step active" id="act-'+lid+'-s1">'
    +'<div class="amir-step-title">'+_stepNum(1)+' 🧮 أيهما أوفر؟</div>'
    +'<div style="background:rgba(255,255,255,0.06);border:1px solid rgba(255,255,255,0.12);border-radius:14px;overflow:hidden;margin-bottom:14px">'
    +'<table style="width:100%;border-collapse:collapse;font-size:16px">'
    +'<tr style="background:rgba(255,255,255,0.1)"><td style="padding:10px 14px;color:rgba(255,255,255,0.6)">وجه المقارنة</td><td style="padding:10px 14px;color:#64B5F6;text-align:center">الحذاء أ</td><td style="padding:10px 14px;color:#FFB300;text-align:center">الحذاء ب</td></tr>'
    +'<tr style="border-top:1px solid rgba(255,255,255,0.08)"><td style="padding:10px 14px;color:rgba(255,255,255,0.8)">السعر</td><td style="padding:10px 14px;color:#81C784;text-align:center;font-weight:700">89 ₪</td><td style="padding:10px 14px;color:#81C784;text-align:center;font-weight:700">55 ₪</td></tr>'
    +'<tr style="border-top:1px solid rgba(255,255,255,0.08)"><td style="padding:10px 14px;color:rgba(255,255,255,0.8)">الجودة</td><td style="padding:10px 14px;color:rgba(255,255,255,0.88);text-align:center">⭐⭐⭐⭐⭐</td><td style="padding:10px 14px;color:rgba(255,255,255,0.88);text-align:center">⭐⭐</td></tr>'
    +'<tr style="border-top:1px solid rgba(255,255,255,0.08)"><td style="padding:10px 14px;color:rgba(255,255,255,0.8)">يدوم</td><td style="padding:10px 14px;color:rgba(255,255,255,0.88);text-align:center">12 شهراً</td><td style="padding:10px 14px;color:rgba(255,255,255,0.88);text-align:center">6 أشهر</td></tr>'
    +'</table></div>'
    +'<div style="font-size:16px;color:rgba(255,255,255,0.88);margin-bottom:12px">أيهما أوفر فعلياً على المدى البعيد؟</div>'
    +_actBtn('أ) الحذاء ب لأنه الأرخص الآن',"_checkAns(this,false,'"+lid+"','l9q1','','💭 إذا تلف بعد 6 أشهر واشتريت غيره، ستدفع 55×2=110 ₪! أكثر من الحذاء أ.')")
    +_actBtn('ب) الحذاء أ لأنه سيدوم 12 شهراً بـ89 ₪',"_checkAns(this,true,'"+lid+"','l9q1','🎉 أحسنت! أ = 7.4 ₪ شهرياً، ب = 9.2 ₪ شهرياً. الجودة توفر المال على المدى البعيد!','')")
    +'<div id="actfb-'+lid+'-l9q1" style="display:none"></div>'
    +'</div>'
    +'<div class="amir-step locked" id="act-'+lid+'-s2">'
    +'<div class="amir-step-title">'+_stepNum(2)+' 💡 ما الأهم عند المقارنة؟</div>'
    +'<div style="font-size:16px;color:rgba(255,255,255,0.8);margin-bottom:12px">رتّب هذه العوامل من الأهم للأقل أهمية عند شراء حذاء مدرسي — اضغط بالترتيب:</div>'
    +'<div id="l9order-'+lid+'" style="display:flex;flex-direction:column;gap:8px">'
    +_actBtn('🛡️ الجودة والمتانة',"_orderGen(this,'1','"+lid+"','l9o',3,'🎉 ممتاز! الجودة أولاً في الأشياء التي تستخدمها يومياً.')")
    +_actBtn('💰 السعر',"_orderGen(this,'2','"+lid+"','l9o',3,'')")
    +_actBtn('🎨 الشكل واللون',"_orderGen(this,'3','"+lid+"','l9o',3,'')")
    +'</div>'
    +'<div id="actfb-'+lid+'-l9order" style="display:none"></div>'
    +'</div></div>';
}

// ===================== L9b: الكسب الأخضر =====================
function buildActivityL9b(lid) {
  return '<div class="amir-activity" id="act-'+lid+'">'
    +_actHeader('♻️','فعالية: "ياسمين وزجاجات الحي"','احسب كم ستربح من إعادة التدوير')
    +'<div class="amir-step active" id="act-'+lid+'-s1">'
    +'<div class="amir-step-title">'+_stepNum(1)+' 🧮 حساب الأرباح</div>'
    +'<div style="'+ACT_YELLOW_BOX+'">♻️ ياسمين جمعت <strong style="color:#FFD54F">80 زجاجة صغيرة</strong><br>كل زجاجة = <strong style="color:#81C784">0.25 ₪</strong><br><br>كم ستحصل من المحطة؟</div>'
    +_actBtn('أ) 8 ₪',"_checkAns(this,false,'"+lid+"','l9bq1','','💭 الحساب: 80 × 0.25 = ؟ ليس 8...')")
    +_actBtn('ب) 20 ₪',"_checkAns(this,true,'"+lid+"','l9bq1','🎉 ممتاز! 80 × 0.25 = 20 ₪. مال حقيقي من شيء كان سيُرمى في القمامة!','')")
    +_actBtn('ج) 80 ₪',"_checkAns(this,false,'"+lid+"','l9bq1','','💭 كل زجاجة = 0.25 فقط! 80 × 0.25 = 20 ₪.')")
    +'<div id="actfb-'+lid+'-l9bq1" style="display:none"></div>'
    +'</div>'
    +'<div class="amir-step locked" id="act-'+lid+'-s2">'
    +'<div class="amir-step-title">'+_stepNum(2)+' 💰 تقسيم ذكي</div>'
    +'<div style="'+ACT_BOX+'">ياسمين ربحت 20 ₪. تريد توزيعها بين التوفير والتبرع.<br><br>ما التوزيع الأحكم؟</div>'
    +_actBtn('أ) 20 ₪ توفير كلها',"_checkAns(this,false,'"+lid+"','l9bq2','','💭 التوفير ممتاز، لكن ياسمين أرادت أيضاً أن يكون لأفعالها أثر اجتماعي!')")
    +_actBtn('ب) 10 ₪ توفير + 10 ₪ تبرع',"_checkAns(this,true,'"+lid+"','l9bq2','🎉 رائع! هذا بالضبط ما فعلته ياسمين — توازن بين مستقبلها ومجتمعها!','')")
    +_actBtn('ج) 20 ₪ تبرع كلها',"_checkAns(this,false,'"+lid+"','l9bq2','','💭 التبرع رائع، لكن التوفير مهم أيضاً للمستقبل!')")
    +'<div id="actfb-'+lid+'-l9bq2" style="display:none"></div>'
    +'</div></div>';
}

// ===================== L4a: ما هو العمل =====================
function buildActivityL4a(lid) {
  return '<div class="amir-activity" id="act-'+lid+'">'
    +_actHeader('🏪','فعالية: "عمر وعربة العصير"','احسب ربح عمر')
    +'<div class="amir-step active" id="act-'+lid+'-s1">'
    +'<div class="amir-step-title">'+_stepNum(1)+' 🧮 حساب الربح</div>'
    +'<div style="'+ACT_YELLOW_BOX+'">عمر اشترى مواد بـ<strong style="color:#FF8A65">9 ₪</strong><br>صنع <strong style="color:#FFD54F">6 أكواب</strong> وباع كل كوب بـ<strong style="color:#81C784">3 ₪</strong><br>جمع: 6 × 3 = <strong style="color:#81C784">18 ₪</strong><br><br>كم ربح عمر؟</div>'
    +_actBtn('أ) 18 ₪',"_checkAns(this,false,'"+lid+"','l4aq1','','💭 18 ₪ هو كل ما جمع، لكنه دفع 9 ₪ للمواد! الربح = المبيعات - التكلفة.')")
    +_actBtn('ب) 9 ₪',"_checkAns(this,true,'"+lid+"','l4aq1','🎉 ممتاز! 18 - 9 = 9 ₪ ربح. عمر ضاعف ماله بالعمل والتفكير!','')")
    +_actBtn('ج) 3 ₪',"_checkAns(this,false,'"+lid+"','l4aq1','','💭 الربح = المبيعات الكلية - التكلفة الكلية. ليس سعر كوب واحد!')")
    +'<div id="actfb-'+lid+'-l4aq1" style="display:none"></div>'
    +'</div>'
    +'<div class="amir-step locked" id="act-'+lid+'-s2">'
    +'<div class="amir-step-title">'+_stepNum(2)+' 💰 تحدي سارة</div>'
    +'<div style="'+ACT_BOX+'">سارة اشترت مواد لصنع الكعك بـ<strong style="color:#FF8A65">12 ₪</strong>، وباعت الكعك كله بـ<strong style="color:#81C784">20 ₪</strong>.<br><br>كم ربحت سارة؟</div>'
    +_actBtn('أ) 8 ₪',"_checkAns(this,true,'"+lid+"','l4aq2','🎉 ممتاز! 20 - 12 = 8 ₪ ربح. سارة تاجرة ذكية!','')")
    +_actBtn('ب) 20 ₪',"_checkAns(this,false,'"+lid+"','l4aq2','','💭 20 ₪ هو سعر البيع، لكنها دفعت 12 ₪! الربح = 20 - 12 = 8 ₪.')")
    +_actBtn('ج) 32 ₪',"_checkAns(this,false,'"+lid+"','l4aq2','','💭 الربح ليس جمعاً — هو طرح! 20 - 12 = 8 ₪.')")
    +'<div id="actfb-'+lid+'-l4aq2" style="display:none"></div>'
    +'</div></div>';
}

// ===================== L4b: فكرة عملي =====================
function buildActivityL4b(lid) {
  return '<div class="amir-activity" id="act-'+lid+'">'
    +_actHeader('💡','فعالية: "ليلى ومشروع الأسئلة الثلاثة"','ابحث عن مشروعك المناسب')
    +'<div class="amir-step active" id="act-'+lid+'-s1">'
    +'<div class="amir-step-title">'+_stepNum(1)+' ❓ السؤال الأهم</div>'
    +'<div style="'+ACT_YELLOW_BOX+'">يوسف يجيد الطبخ، وجيرانه مشغولون دائماً.<br><br>ما المشروع الأنسب ليوسف؟</div>'
    +_actBtn('أ) تعليم الرياضيات للأطفال',"_checkAns(this,false,'"+lid+"','l4bq1','','💭 هذا مشروع جيد، لكنه لا يناسب مهارة يوسف في الطبخ!')")
    +_actBtn('ب) تحضير وجبات أو حلويات للبيع للجيران',"_checkAns(this,true,'"+lid+"','l4bq1','🎉 ممتاز! يوسف يجيد الطبخ والجيران يحتاجون — وصفة نجاح مثالية!','')")
    +_actBtn('ج) فتح دكانة كبيرة',"_checkAns(this,false,'"+lid+"','l4bq1','','💭 الدكانة الكبيرة تحتاج رأس مال كبير. ابدأ صغيراً وكبّر مع الوقت!')")
    +'<div id="actfb-'+lid+'-l4bq1" style="display:none"></div>'
    +'</div>'
    +'<div class="amir-step locked" id="act-'+lid+'-s2">'
    +'<div class="amir-step-title">'+_stepNum(2)+' 🌟 ابحث عن مشروعك</div>'
    +'<div style="'+ACT_BOX+' margin-bottom:14px">أجب على الأسئلة الثلاثة لتجد مشروعك:<br><br>'
    +'<strong style="color:#64B5F6">1️⃣ ما الذي تجيده؟</strong><br>'
    +'<div style="display:flex;flex-wrap:wrap;gap:6px;margin:8px 0">'
    +['رسم','طبخ','رياضة','قراءة','موسيقى','برمجة'].map(function(s){
      return '<button onclick="this.style.background=\'rgba(21,101,192,0.3)\';this.style.borderColor=\'#42A5F5\';" style="padding:8px 14px;border-radius:20px;border:1.5px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.9);font-family:Noto Naskh Arabic,serif;font-size:15px;cursor:pointer">'+s+'</button>';
    }).join('')
    +'</div>'
    +'<strong style="color:#FFB300">2️⃣ من حولك يحتاج؟</strong><br>'
    +'<div style="display:flex;flex-wrap:wrap;gap:6px;margin:8px 0">'
    +['جيران','زملاء','أطفال صغار','كبار السن'].map(function(s){
      return '<button onclick="this.style.background=\'rgba(255,179,0,0.2)\';this.style.borderColor=\'#FFB300\';" style="padding:8px 14px;border-radius:20px;border:1.5px solid rgba(255,255,255,0.2);background:rgba(255,255,255,0.08);color:rgba(255,255,255,0.9);font-family:Noto Naskh Arabic,serif;font-size:15px;cursor:pointer">'+s+'</button>';
    }).join('')
    +'</div></div>'
    +'<div style="'+ACT_GREEN_FB.replace('display:block;','')+'">💡 كل مهارة + حاجة من حولك = مشروع محتمل! ابدأ صغيراً وكبّر مع الوقت.</div>'
    +'</div></div>';
}

// ===================== L4c: من هو زبوني =====================
function buildActivityL4c(lid) {
  return '<div class="amir-activity" id="act-'+lid+'">'
    +_actHeader('🤝','فعالية: "أحمد وعصير الليمون"','تعلم تفهم ما يريده زبونك')
    +'<div class="amir-step active" id="act-'+lid+'-s1">'
    +'<div class="amir-step-title">'+_stepNum(1)+' 🤔 لماذا لم يبع أحمد؟</div>'
    +'<div style="'+ACT_YELLOW_BOX+'">أحمد باع عصير ليمون لكن لم يشترِ منه أحد الأسبوع الأول.<br>قال الزملاء: «العصير مر جداً!» و«نريده بارداً!»<br><br>ماذا يفعل أحمد؟</div>'
    +_actBtn('أ) يستمر في نفس الطريقة لأن العصير لذيذ',"_checkAns(this,false,'"+lid+"','l4cq1','','💭 إذا لم يشترِ أحد يجب التغيير! العمل الناجح يستمع للزبون.')")
    +_actBtn('ب) يستمع للملاحظات ويغيّر: يضيف سكراً وثلجاً',"_checkAns(this,true,'"+lid+"','l4cq1','🎉 ممتاز! أحمد استمع لزبائنه وغيّر — في الأسبوع الثاني باع 30 كوباً!','')")
    +_actBtn('ج) يوقف المشروع ويبحث عن شيء آخر',"_checkAns(this,false,'"+lid+"','l4cq1','','💭 الفشل الأول درس وليس نهاية! استمع وطوّر المنتج أولاً.')")
    +'<div id="actfb-'+lid+'-l4cq1" style="display:none"></div>'
    +'</div>'
    +'<div class="amir-step locked" id="act-'+lid+'-s2">'
    +'<div class="amir-step-title">'+_stepNum(2)+' 🎯 فهم الزبون</div>'
    +'<div style="'+ACT_BOX+'">نور تبيع كعكاً بالشوكولاتة لكن لا أحد يشتري. الزملاء قالوا: «كثيرون منا لا يأكلون الشوكولاتة».<br><br>ما القرار الأذكى؟</div>'
    +_actBtn('أ) تستمر لأن الكعك لذيذ',"_checkAns(this,false,'"+lid+"','l4cq2','','💭 إذا لم يشترِ أحد يجب التغيير! العمل يخدم الزبون لا البائع.')")
    +_actBtn('ب) تضيف خياراً بالفانيليا أو الفراولة',"_checkAns(this,true,'"+lid+"','l4cq2','🎉 قرار ذكي! نور استمعت لزبائنها وغيّرت — هذا ما يفعله التاجر الناجح!','')")
    +_actBtn('ج) تخفض السعر فقط',"_checkAns(this,false,'"+lid+"','l4cq2','','💭 تخفيض السعر لن يحل المشكلة إذا كان المنتج لا يناسب الزبون!')")
    +'<div id="actfb-'+lid+'-l4cq2" style="display:none"></div>'
    +'</div></div>';
}

// ===================== L4d: ربح أم خسارة =====================
function buildActivityL4d(lid) {
  return '<div class="amir-activity" id="act-'+lid+'">'
    +_actHeader('📊','فعالية: "تامر من الخسارة للربح"','احسب نقطة التعادل')
    +'<div class="amir-step active" id="act-'+lid+'-s1">'
    +'<div class="amir-step-title">'+_stepNum(1)+' 📉 خسارة تامر</div>'
    +'<div style="'+ACT_YELLOW_BOX+'">تامر دفع <strong style="color:#FF8A65">45 ₪</strong> للمواد<br>باع <strong style="color:#FFD54F">10 أكواب</strong> بـ<strong style="color:#81C784">3 ₪</strong> للكوب<br>جمع: 10 × 3 = <strong style="color:#81C784">30 ₪</strong><br><br>هل ربح أم خسر؟</div>'
    +_actBtn('أ) ربح 15 ₪',"_checkAns(this,false,'"+lid+"','l4dq1','','💭 الربح = مبيعات - تكلفة. 30 - 45 = ؟ هل هذا ربح؟')")
    +_actBtn('ب) خسر 15 ₪',"_checkAns(this,true,'"+lid+"','l4dq1','🎉 صحيح! 30 - 45 = ناقص 15. تامر خسر لأنه باع بأقل من التكلفة!','')")
    +_actBtn('ج) لم يربح ولم يخسر',"_checkAns(this,false,'"+lid+"','l4dq1','','💭 30 ≠ 45! هناك فرق. المبيعات أقل من التكلفة = خسارة.')")
    +'<div id="actfb-'+lid+'-l4dq1" style="display:none"></div>'
    +'</div>'
    +'<div class="amir-step locked" id="act-'+lid+'-s2">'
    +'<div class="amir-step-title">'+_stepNum(2)+' ⚖️ نقطة التعادل</div>'
    +'<div style="'+ACT_BOX+'">خالد اشترى مواد بـ<strong style="color:#FF8A65">24 ₪</strong> ويبيع كل كوب بـ<strong style="color:#81C784">4 ₪</strong>.<br><br>كم كوباً يحتاج يبيع لاسترداد تكلفته؟</div>'
    +_actBtn('أ) 4 أكواب',"_checkAns(this,false,'"+lid+"','l4dq2','','💭 4 × 4 = 16 ₪ — أقل من التكلفة! المعادلة: 24 ÷ 4 = ؟')")
    +_actBtn('ب) 6 أكواب',"_checkAns(this,true,'"+lid+"','l4dq2','🎉 ممتاز! 24 ÷ 4 = 6. من الكوب السابع — كل كوب ربح خالص!','')")
    +_actBtn('ج) 24 كوباً',"_checkAns(this,false,'"+lid+"','l4dq2','','💭 كثير جداً! المعادلة: التكلفة ÷ سعر البيع = 24 ÷ 4 = 6 أكواب.')")
    +'<div id="actfb-'+lid+'-l4dq2" style="display:none"></div>'
    +'</div></div>';
}

// ===================== L5a: الضرائب =====================
function buildActivityL5a(lid) {
  return '<div class="amir-activity" id="act-'+lid+'">'
    +_actHeader('🏛️','فعالية: "سؤال رنا في الحافلة"','افهم لماذا نحتاج الضرائب')
    +'<div class="amir-step active" id="act-'+lid+'-s1">'
    +'<div class="amir-step-title">'+_stepNum(1)+' ❓ لماذا نحتاج الضرائب؟</div>'
    +'<div style="'+ACT_YELLOW_BOX+'">رنا سألت: «من يدفع راتب سائق الحافلة؟» — أمها: «الحكومة».<br>رنا: «ومن أين يأتي مال الحكومة؟»<br><br>ما الجواب الصحيح؟</div>'
    +_actBtn('أ) الحكومة تطبع المال كما تريد',"_checkAns(this,false,'"+lid+"','l5aq1','','💭 طباعة مال بدون غطاء تسبب التضخم! المال يأتي من مصدر حقيقي...')")
    +_actBtn('ب) كل من يعمل يدفع جزءاً من دخله كضريبة',"_checkAns(this,true,'"+lid+"','l5aq1','🎉 ممتاز! الضرائب هي الطريقة التي نبني بها المجتمع معاً. كل شخص يساهم بجزء صغير.','')")
    +_actBtn('ج) الحكومة تأخذ المال من الأغنياء فقط',"_checkAns(this,false,'"+lid+"','l5aq1','','💭 كل من يعمل أو يشتري يدفع نوعاً من الضرائب — حتى عند شراء عصير!')")
    +'<div id="actfb-'+lid+'-l5aq1" style="display:none"></div>'
    +'</div>'
    +'<div class="amir-step locked" id="act-'+lid+'-s2">'
    +'<div class="amir-step-title">'+_stepNum(2)+' 🔄 ماذا تبني الضرائب؟</div>'
    +'<div style="font-size:16px;color:rgba(255,255,255,0.8);margin-bottom:12px">وصّل كل ضريبة بما تموّله:</div>'
    +[
      ['ضريبة الدخل','رواتب المعلمين والأطباء','l5am1',true],
      ['ضريبة القيمة المضافة (مع كل شراء)','الطرق والجسور','l5am2',false],
      ['أرنونا (ضريبة البلدية)','تنظيف الشوارع والحدائق','l5am3',true]
    ].map(function(item){
      return '<div style="'+ACT_BOX+' margin-bottom:8px"><strong style="color:#64B5F6">'+item[0]+'</strong> ← '+item[2]+'<br>'
        +'هل هذا التوصيل صحيح؟<div style="display:flex;gap:8px;margin-top:8px">'
        +'<button onclick="_tfCheck(this,'+item[3]+',\''+lid+'\',\''+item[2]+'\',\'🎉 صحيح!\',\'💭 فكّر مجدداً — كل ضريبة لها هدف خاص!\')" style="'+ACT_BTN+'width:auto;flex:1">✅ نعم</button>'
        +'<button onclick="_tfCheck(this,'+(!item[3])+',\''+lid+'\',\''+item[2]+'\',\'🎉 صحيح!\',\'💭 فكّر مجدداً!\')" style="'+ACT_BTN+'width:auto;flex:1">❌ لا</button>'
        +'<div id="actfb-'+lid+'-'+item[2]+'" style="display:none"></div></div></div>';
    }).join('')
    +'</div></div>';
}

// ===================== L5b: البنك =====================
function buildActivityL5b(lid) {
  return '<div class="amir-activity" id="act-'+lid+'">'
    +_actHeader('🏦','فعالية: "كريم وجده والصندوق القديم"','افهم كيف يعمل البنك')
    +'<div class="amir-step active" id="act-'+lid+'-s1">'
    +'<div class="amir-step-title">'+_stepNum(1)+' 💰 سؤال الجد</div>'
    +'<div style="'+ACT_YELLOW_BOX+'">سامي وضع <strong style="color:#FFD54F">500 ₪</strong> في البنك.<br>بعد سنة أصبحت <strong style="color:#81C784">510 ₪</strong>.<br><br>من أين جاءت الـ10 ₪ الإضافية؟</div>'
    +_actBtn('أ) البنك أعطاه هدية',"_checkAns(this,false,'"+lid+"','l5bq1','','💭 ليست هدية عشوائية! هذا له اسم محدد في عالم المال...')")
    +_actBtn('ب) فائدة — مكافأة لأنه ترك ماله في البنك',"_checkAns(this,true,'"+lid+"','l5bq1','🎉 ممتاز! الفائدة هي عائد التوفير. 10 ₪ على 500 ₪ = 2% فائدة سنوية.','')")
    +_actBtn('ج) سامي نسي أنه أضاف 10 ₪',"_checkAns(this,false,'"+lid+"','l5bq1','','💭 البنك هو من أضافها تلقائياً كفائدة على المبلغ المودع!')")
    +'<div id="actfb-'+lid+'-l5bq1" style="display:none"></div>'
    +'</div>'
    +'<div class="amir-step locked" id="act-'+lid+'-s2">'
    +'<div class="amir-step-title">'+_stepNum(2)+' 🔄 دورة البنك</div>'
    +'<div style="font-size:16px;color:rgba(255,255,255,0.8);margin-bottom:12px">رتّب خطوات دورة البنك بالترتيح الصحيح:</div>'
    +'<div style="display:flex;flex-direction:column;gap:8px">'
    +_actBtn('3️⃣ البنك يأخذ الفرق كربح',"_orderGen(this,'3','"+lid+"','l5bo',4,'🎉 ممتاز! هكذا يعمل البنك لصالح الجميع.')")
    +_actBtn('1️⃣ أنت تودع مالك في البنك',"_orderGen(this,'1','"+lid+"','l5bo',4,'')")
    +_actBtn('4️⃣ أنت تحصل على فائدة صغيرة',"_orderGen(this,'4','"+lid+"','l5bo',4,'')")
    +_actBtn('2️⃣ البنك يُقرض مالك لآخرين بفائدة أعلى',"_orderGen(this,'2','"+lid+"','l5bo',4,'')")
    +'</div>'
    +'<div id="actfb-'+lid+'-l5border" style="display:none"></div>'
    +'</div></div>';
}

// ===================== L5c: بطاقة الائتمان =====================
function buildActivityL5c(lid) {
  return '<div class="amir-activity" id="act-'+lid+'">'
    +_actHeader('💳','فعالية: "عمو خالد والبطاقة السحرية"','تعلم استخدام البطاقة بذكاء')
    +'<div class="amir-step active" id="act-'+lid+'-s1">'
    +'<div class="amir-step-title">'+_stepNum(1)+' ⚠️ خطر الدين</div>'
    +'<div style="'+ACT_YELLOW_BOX+'">سلمى تريد حذاءً بـ<strong style="color:#FF8A65">200 ₪</strong>.<br>عندها <strong style="color:#FFD54F">150 ₪</strong> فقط في حسابها.<br><br>ماذا يجب أن تفعل؟</div>'
    +_actBtn('أ) تشتري الآن وتدفع لاحقاً بالبطاقة',"_checkAns(this,false,'"+lid+"','l5cq1','','💭 خطر! إذا لم يكن عندها 200 ₪ عند موعد الدفع ستدفع فائدة ويكبر الدين.')")
    +_actBtn('ب) تنتظر حتى توفر الـ50 ₪ الباقية',"_checkAns(this,true,'"+lid+"','l5cq1','🎉 قرار حكيم! الانتظار والتوفير أفضل بكثير من الوقوع في فخ الديون.','')")
    +_actBtn('ج) تأخذ قرضاً لشراء الحذاء',"_checkAns(this,false,'"+lid+"','l5cq1','','💭 قرض لشراء حذاء؟ ستدفع أكثر من قيمته بسبب الفائدة. الأفضل التوفير.')")
    +'<div id="actfb-'+lid+'-l5cq1" style="display:none"></div>'
    +'</div>'
    +'<div class="amir-step locked" id="act-'+lid+'-s2">'
    +'<div class="amir-step-title">'+_stepNum(2)+' 💸 حساب الدين</div>'
    +'<div style="'+ACT_BOX+'">عمو خالد اشترى بالبطاقة بـ<strong style="color:#FF8A65">1300 ₪</strong>.<br>لم يدفع في الموعد — البنك أضاف <strong style="color:#EF5350">100 ₪ فائدة</strong>.<br><br>كم أصبح الدين؟</div>'
    +_actBtn('أ) 1300 ₪ — لم يتغير',"_checkAns(this,false,'"+lid+"','l5cq2','','💭 الفائدة تُضاف للدين الأصلي! 1300 + 100 = ؟')")
    +_actBtn('ب) 1400 ₪',"_checkAns(this,true,'"+lid+"','l5cq2','🎉 صحيح! 1300 + 100 = 1400 ₪. وكل شهر تأخير يزيد الدين أكثر!','')")
    +_actBtn('ج) 100 ₪ فقط',"_checkAns(this,false,'"+lid+"','l5cq2','','💭 الفائدة 100 ₪ تُضاف للدين الأصلي 1300 ₪!')")
    +'<div id="actfb-'+lid+'-l5cq2" style="display:none"></div>'
    +'</div></div>';
}

// ===================== L5d: حلمي المالي =====================
function buildActivityL5d(lid) {
  return '<div class="amir-activity" id="act-'+lid+'">'
    +_actHeader('🌟','فعالية: "حلم مريم الكبير"','خطط لهدفك المالي خطوة بخطوة')
    +'<div class="amir-step active" id="act-'+lid+'-s1">'
    +'<div class="amir-step-title">'+_stepNum(1)+' 🧮 حساب مدة التوفير</div>'
    +'<div style="'+ACT_YELLOW_BOX+'">مريم تحلم بمكتبة تكلف <strong style="color:#FFD54F">10,000 ₪</strong><br>تستطيع توفير <strong style="color:#81C784">100 ₪</strong> كل شهر<br><br>كم شهراً تحتاج؟</div>'
    +_actBtn('أ) 50 شهراً',"_checkAns(this,false,'"+lid+"','l5dq1','','💭 50 × 100 = 5000 ₪ — نصف المبلغ فقط! المعادلة: 10000 ÷ 100 = ؟')")
    +_actBtn('ب) 100 شهر (8 سنوات تقريباً)',"_checkAns(this,true,'"+lid+"','l5dq1','🎉 ممتاز! 10000 ÷ 100 = 100 شهر. مريم تحتاج 8 سنوات — لكن الحلم ممكن!','')")
    +_actBtn('ج) 1000 شهر',"_checkAns(this,false,'"+lid+"','l5dq1','','💭 1000 × 100 = 100,000 ₪ — أكثر بكثير! المعادلة: 10000 ÷ 100 = 100 شهراً.')")
    +'<div id="actfb-'+lid+'-l5dq1" style="display:none"></div>'
    +'</div>'
    +'<div class="amir-step locked" id="act-'+lid+'-s2">'
    +'<div class="amir-step-title">'+_stepNum(2)+' 🎯 تحدي الحساب</div>'
    +'<div style="'+ACT_BOX+'">هدف: دراجة بـ<strong style="color:#FFD54F">600 ₪</strong><br>يستطيع توفير <strong style="color:#81C784">50 ₪</strong> كل شهر.<br><br>كم شهراً يحتاج؟</div>'
    +_actBtn('أ) 6 أشهر',"_checkAns(this,false,'"+lid+"','l5dq2','','💭 6 × 50 = 300 ₪ فقط — نصف المبلغ! المعادلة: 600 ÷ 50 = ؟')")
    +_actBtn('ب) 12 شهراً',"_checkAns(this,true,'"+lid+"','l5dq2','🎉 ممتاز! 600 ÷ 50 = 12. بعد سنة من التوفير المنتظم — الدراجة له!','')")
    +_actBtn('ج) 50 شهراً',"_checkAns(this,false,'"+lid+"','l5dq2','','💭 50 × 50 = 2500 ₪ — أكثر من السعر! المعادلة الصحيحة: 600 ÷ 50 = 12 شهراً.')")
    +'<div id="actfb-'+lid+'-l5dq2" style="display:none"></div>'
    +'</div></div>';
}

// Generic order helper
var _genOrder={};
function _orderGen(btn,num,lid,key,total,doneMsg){
  var k=lid+key;
  if(!_genOrder[k])_genOrder[k]={next:1,done:0};
  var s=_genOrder[k];
  if(btn.dataset.done)return;
  if(parseInt(num)===s.next){
    btn.style.cssText+=';border-color:#66BB6A;background:rgba(102,187,106,0.2);color:#81C784;';
    btn.dataset.done='1';s.next++;s.done++;
    if(s.done===total&&doneMsg){
      var fb=document.getElementById('actfb-'+lid+'-'+key+'order');
      if(!fb){fb=document.createElement('div');fb.id='actfb-'+lid+'-'+key+'order';btn.parentNode.appendChild(fb);}
      fb.innerHTML=doneMsg;fb.style.cssText=ACT_GREEN_FB;
    }
  } else {
    btn.style.cssText+=';border-color:#EF5350;background:rgba(239,83,80,0.15);';
    setTimeout(function(){btn.style.borderColor='rgba(255,255,255,0.2)';btn.style.background='rgba(255,255,255,0.08)';btn.style.color='rgba(255,255,255,0.92)';},800);
  }
}

// ============================================================
// Activity builder dispatcher
// ============================================================
function buildLessonActivity(lid) {
  var map = {
    'l1': buildActivityL1,
    'l2': buildActivityL2,
    'l3': buildActivityL3,
    'l4': buildActivityL4,
    'l5': buildActivityL5,
    'l6': buildActivityL6,
    'l7': buildActivityL7,
    'l7b': buildActivityL7b,
    'l8': buildActivityL8,
    'l9': buildActivityL9,
    'l9b': buildActivityL9b,
    'l4a': buildActivityL4a,
    'l4b': buildActivityL4b,
    'l4c': buildActivityL4c,
    'l4d': buildActivityL4d,
    'l5a': buildActivityL5a,
    'l5b': buildActivityL5b,
    'l5c': buildActivityL5c,
    'l5d': buildActivityL5d
  };
  if (map[lid]) return map[lid](lid);
  return '';
}
