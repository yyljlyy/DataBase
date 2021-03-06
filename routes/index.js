var express = require('express');
var router = express.Router();
var until = require("./../until/MySQLutils.js");
var muntil = require("./../until/MongoDBUntil.js");
var runtil = require("./../until/RedisUntil.js");


/* GET home page. */
router.get('/', function(req, res, next) {
  until.client.query('select * from t_user;', function (error, rows, fields) {
      if (error) {
        console.log("ClientReady Error:" + error.message);
        return;
      } else {
        res.render('index', { rows: rows });
      }
  })
});

router.get('/ms_save',function(req,res,next){
  req.setEncoding("utf8");
  until._insert(until.client,"insert into t_user set name=?,age=?,address=?",[req.param('name'),req.param('age'),req.param('address')])
  res.end(JSON.stringify("添加成功!"));
});

router.get('/ms_delete',function(req,res,next){
  until._delete(until.client,"delete from t_user where id=?",[req.param('id')])
  res.end(JSON.stringify("删除成功!"));
});

router.get('/ms_update',function(req,res,next){
  until._update(until.client,"update t_user set name=?,age=?,address=? where id=?",[req.param('name'),req.param('age'),req.param('address'),req.param('id')]);
  res.end(JSON.stringify("更新成功!"));
});

router.get('/mongo_list',function(req,res,next){

    muntil.allUsers(req.param('page'),req.param('rows'),function (err, users) {
        if (err) {
            return next(err);
        }
        muntil.forAll(function(err,count){
            if (err) {
                return next(err);
            }
            res.end(JSON.stringify({rows:users,total:count}));
        });

    });
});

router.get('/mongo_add',function(req,res,next){
    req.setEncoding("utf8");;
    muntil.add(req.param('name'),req.param('age'),req.param('address'),function(err,info){
        if(err){
            return next(err)
        }
        res.end(JSON.stringify('添加成功'));
    });
});
router.get('/mongo_update',function(req,res,next){
    req.setEncoding("utf8");
    muntil.editData(req.param('_id'),req.param('name'),req.param('age'),req.param('address'),function(err,info){
        if(err){
            return next(err)
        }
        res.end(JSON.stringify('修改成功'));
    });
});
router.get('/mongo_delete',function(req,res,next){
    muntil.delete(req.param('name'),function(err,info){
        if(err){
            return next(err)
        }
        res.end(JSON.stringify('删除成功'));
    });
});

//router.get('/redis_get',function(req,res,next){
//    runtil.getmInfo('0',function(err,doc){
//        if(err){
//           console.error(err)
//        }
//        res.end(JSON.stringify(doc));
//    })
//});
//
//router.get('/redis_set',function(req,res,next){
//    var list = {};
//    list.google='name:google';
//    list.sogou=200;
//    list.haosou=100;
//    list.bing=20;
//    runtil.setInfo('0',list,function(err,doc){
//        if(err){
//            return next(err)
//        }
//        res.end(JSON.stringify(doc));
//    })
//});

//router.get('/redis_list',function(req,res,next){
//    var list = {};
//    list.google='name:google';
//    list.sogou=200;
//    list.haosou=100;
//    list.bing=20;
//    runtil.setList('0',list,function(err,doc){
//        if(err){
//            return next(err)
//        }
//        res.end(JSON.stringify(doc));
//    })
//});

module.exports = router;
