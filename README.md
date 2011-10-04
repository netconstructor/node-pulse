Collects ping times from a list of servers and displays in a chart.

![Node Pulse](http://aaronpk.github.com/node-pulse.png "Node Pulse")

How to use
==========

Install this on each server you want to add to the pool to be measured. Copy `config.template.js`
to `config.js` and update the list of servers as appropriate. I've found it works quite a bit better
if you enter the servers' IP addresses to avoid doing a DNS lookup each time.

Start the scripts on all the servers as background processes, such as with this command:
`nohup node pulse.js &` They will begin collecting timing information from each server in the list,
and will send that information to each other server as well.

You can then visit http://example.com:50505/stats in a browser to see its report.


License
=======
Copyright (c) 2011 Aaron Parecki

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.