webpackJsonp([13],{243:function(t,e,a){"use strict";function n(t){d||a(366)}Object.defineProperty(e,"__esModule",{value:!0});var o=a(291),s=a.n(o);for(var i in o)"default"!==i&&function(t){a.d(e,t,function(){return o[t]})}(i);var p=a(368),r=a.n(p),d=!1,c=a(9),l=n,v=c(s.a,r.a,!1,l,"data-v-70d66736",null);v.options.__file="src/views/storeManagement/storeData.vue",e.default=v.exports},291:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={data:function(){return{pageNo:0,shopId:1,startTime:"",endTime:"",shopList:[],shopSeclect:[],incomeTotal:0,shopIncomeDetail:[],incomeGroups:[],flag:0,flag1:0,flag2:0,table:[{title:"序号",type:"index",align:"center",width:60},{title:"时间",align:"center",key:"yearMonth"},{title:"收益总数",align:"center",key:"totalMoney"},{title:"充值收益",align:"center",render:function(t,e){var a=void 0;return e.row.shopIncomeDetailsItemDtoList.map(function(t){return a=1===t.type?t.money:0}),t("p",a)}},{title:"消费收益",align:"center",render:function(t,e){var a=void 0;return e.row.shopIncomeDetailsItemDtoList.map(function(t){return a=2===t.type?t.money:0}),t("p",a)}},{title:"定制收益",align:"center",render:function(t,e){var a=void 0;return e.row.shopIncomeDetailsItemDtoList.map(function(t){return a=3===t.type?t.money:0}),t("p",a)}}]}},created:function(){this.getShopList(),this.getShopData()},methods:{getShopList:function(){var t=this,e=t.serviceurl+"/backstage/shop/pageShop",a={pageNo:t.pageNo,pageSize:10};t.$http(e,a,"","get").then(function(e){if(0===e.data.retCode){t.shopList=t.shopList.concat(e.data.data.data);var a=parseInt(e.data.data.total);t.shopList.length<a&&(t.pageNo++,t.getShopList()),t.shopList.map(function(e){t.shopSeclect.push({value:e.id,label:e.shopName})})}else t.$Message.warning(e.data.retMsg)}).catch(function(e){t.$Message.error("请求错误")})},changeTime:function(t){this.startTime=t[0],this.endTime=t[1],""===t[0]&&(this.startTime=""),""===t[1]&&(this.endTime="")},getShopData:function(){var t=this;t.initdata();var e=t.serviceurl+"/backstage/shop/getShopData",a={shopId:t.shopId,startTime:t.startTime,endTime:t.endTime},n=null;t.$http(e,a,n,"get").then(function(e){n=e.data,0===n.retCode?(t.shopIncomeDetail=n.data.shopIncomeDetailsDtos,t.incomeGroups=n.data.shopIncomeDto.incomeGroups,t.incomeTotal=n.data.shopIncomeDto.total,t.incomeGroups.map(function(e){1===e.type&&(t.flag=1),2===e.type&&(t.flag1=1),3===e.type&&(t.flag2=1)})):t.$Message.warning(n.retMsg)}).catch(function(e){t.$Message.error("请求错误")})},initdata:function(){var t=this;t.flag=0,t.flag1=0,t.flag2=0,t.shopIncomeDetail=[],t.incomeGroups=[],t.incomeTotal=0}}}},366:function(t,e,a){var n=a(367);"string"==typeof n&&(n=[[t.i,n,""]]),n.locals&&(t.exports=n.locals);a(16)("cc14c33e",n,!1,{})},367:function(t,e,a){e=t.exports=a(15)(!1),e.push([t.i,"\n.store-data-top[data-v-70d66736] {\n  display: -ms-flexbox;\n  display: flex;\n  margin-bottom: 15px;\n}\n.store-data-top p[data-v-70d66736] {\n  margin-right: 25px;\n}\n.store-data-income[data-v-70d66736] {\n  margin-bottom: 15px;\n}\n.store-data-income .income-title[data-v-70d66736] {\n  height: 32px;\n  line-height: 32px;\n  padding-left: 54px;\n  font-size: 18px;\n  font-weight: 600;\n  letter-spacing: 2px;\n}\n.store-data-income .income-title span[data-v-70d66736] {\n  padding-left: 20px;\n}\n.store-data-income[data-v-70d66736] .ivu-card-body {\n  padding: 40px 20px 16px 20px;\n}\n.store-data-income .income-data[data-v-70d66736] {\n  border-right: 1px solid #000000b5;\n  padding: 0 50px;\n  height: 120px;\n}\n.store-data-income .income-data p[data-v-70d66736] {\n  padding: 10px 0;\n  font-weight: 600;\n  letter-spacing: 1px;\n}\n.store-data-income .income-data p[data-v-70d66736]:nth-child(1) {\n  padding-top: 0;\n}\n.store-data-income .income-data p[data-v-70d66736]:nth-last-child(1) {\n  padding-bottom: 0;\n}\n.store-data-income .income-data p span[data-v-70d66736] {\n  padding-left: 20px;\n  font-size: 18px;\n}\n.store-data-income .income-future[data-v-70d66736] {\n  border: none;\n}\n.store-data-income .income-future p span[data-v-70d66736] {\n  font-size: 20px;\n}\n[data-v-70d66736] .ivu-select-dropdown {\n  top: 53px !important;\n}\n",""])},368:function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0});var n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"main-body store-data"},[a("div",{staticClass:"store-data-top"},[a("p",[t._v("门店选择   \n            "),a("Select",{staticStyle:{width:"130px"},model:{value:t.shopId,callback:function(e){t.shopId=e},expression:"shopId"}},t._l(t.shopSeclect,function(e){return a("Option",{key:e.value,attrs:{value:e.value}},[t._v(t._s(e.label))])}),1)],1),t._v(" "),a("p",[t._v("时间   "),a("DatePicker",{staticStyle:{width:"150px",color:"#444"},attrs:{type:"datetimerange",placeholder:"选择时间段"},on:{"on-change":t.changeTime}})],1),t._v(" "),a("Button",{staticClass:"btn btn-blue",on:{click:t.getShopData}},[t._v("查询")])],1),t._v(" "),a("div",{staticClass:"store-data-income"},[a("Card",[a("p",{staticClass:"income-title",attrs:{slot:"title"},slot:"title"},[t._v("收益总数 "),a("span",[t._v(t._s(t.incomeTotal))])]),t._v(" "),a("Row",[t._l(t.incomeGroups,function(e,n){return a("Col",{key:n,attrs:{span:"4"}},[1===e.type?a("div",{staticClass:"income-data"},[a("p",[t._v("充值收益 "),a("span",[t._v(t._s(e.moeny?e.moeny:0))])]),t._v(" "),a("p",[t._v("推广部分 "),a("span",[t._v(t._s(e.promote?e.promote:0))])]),t._v(" "),a("p",[t._v("补贴部分 "),a("span",[t._v(t._s(e.subsidy?e.subsidy:0))])])]):t._e()])}),t._v(" "),0===t.flag?a("Col",{attrs:{span:"4"}},[a("div",{staticClass:"income-data"},[a("p",[t._v("充值收益 "),a("span",[t._v("0")])]),t._v(" "),a("p",[t._v("推广部分 "),a("span",[t._v("0")])]),t._v(" "),a("p",[t._v("补贴部分 "),a("span",[t._v("0")])])])]):t._e(),t._v(" "),t._l(t.incomeGroups,function(e,n){return a("Col",{key:n,attrs:{span:"4"}},[2===e.type?a("div",{staticClass:"income-data"},[a("p",[t._v("消费收益 "),a("span",[t._v(t._s(e.moeny?e.moeny:0))])]),t._v(" "),a("p",[t._v("推广部分 "),a("span",[t._v(t._s(e.promote?e.promote:0))])]),t._v(" "),a("p",[t._v("补贴部分 "),a("span",[t._v(t._s(e.subsidy?e.subsidy:0))])])]):t._e()])}),t._v(" "),0===t.flag1?a("Col",{attrs:{span:"4"}},[a("div",{staticClass:"income-data"},[a("p",[t._v("消费收益 "),a("span",[t._v("0")])]),t._v(" "),a("p",[t._v("推广部分 "),a("span",[t._v("0")])]),t._v(" "),a("p",[t._v("补贴部分 "),a("span",[t._v("0")])])])]):t._e(),t._v(" "),t._l(t.incomeGroups,function(e,n){return a("Col",{key:n,attrs:{span:"4"}},[3===e.type?a("div",{staticClass:"income-data"},[a("p",[t._v("定制收益 "),a("span",[t._v(t._s(e.moeny?e.moeny:0))])]),t._v(" "),a("p",[t._v("推广部分 "),a("span",[t._v(t._s(e.promote?e.promote:0))])]),t._v(" "),a("p",[t._v("补贴部分 "),a("span",[t._v(t._s(e.subsidy?e.subsidy:0))])])]):t._e()])}),t._v(" "),0===t.flag2?a("Col",{attrs:{span:"4"}},[a("div",{staticClass:"income-data"},[a("p",[t._v("定制收益 "),a("span",[t._v("0")])]),t._v(" "),a("p",[t._v("推广部分 "),a("span",[t._v("0")])]),t._v(" "),a("p",[t._v("补贴部分 "),a("span",[t._v("0")])])])]):t._e(),t._v(" "),a("Col",{attrs:{span:"9"}},[a("div",{staticClass:"income-data income-future"},[a("p",[t._v("商城收益 "),a("span",[t._v("敬请期待")])]),t._v(" "),a("p",[t._v("补贴部分 "),a("span",[t._v("——")])])])])],2)],1)],1),t._v(" "),a("div",{staticClass:"store-data-detail"},[a("p",[t._v("数据明细")]),t._v(" "),a("Table",{staticClass:"cc-m-t-10",attrs:{height:"280",border:"",columns:t.table,data:t.shopIncomeDetail}})],1)])},o=[];n._withStripped=!0;var s={render:n,staticRenderFns:o};e.default=s}});