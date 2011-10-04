// Configure all the servers whose timings you want to measure here
exports.servers = function(){
  return {
    server1: 'server1.example.com',
    server2: 'server2.example.com',
    server3: 'server3.example.com'
  };
};

exports.self = function(){
  return 'server1';
};

exports.listenPort = function(){
  return 80;
};
