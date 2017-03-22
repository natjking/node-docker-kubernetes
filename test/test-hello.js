var chai = require('chai');
var chaiHttp = require('chai-http');
var should = chai.should();

chai.use(chaiHttp);

describe('hello', function() {
  it('should return 200 on port 8080', function(done) {
    chai.request('http://localhost:8080')
      .get('/hello')
      .end(function(err, res) {
         res.should.not.have.status(200);
         done();
      });
  });
  it('should fail on port 8081', function(done) {
    chai.request('http://localhost:8081')
      .get('/hello')
      .end(function(err, res) {
         res.should.have.status(200);
         done();
      });
  });
});
