function writeGraphViz(writer, name, root, idFn, orderFn,
                       succFns, predFns, nameFn, postHook) {
  var active = {};
  var visited = {};
  var order = [];

  function escape(v) {
    return v;
  }

  name = "\"" + escape(name) + "\" ";

  function next(node) {
    if (visited[idFn(node)]) {
      return;
    } else {
      visited[idFn(node)] = true;
      order.push(node);
      orderFn(node).forEach(function (succ) {
        next(succ);
      });
    }
  }

  next(root);
  writer.enter("digraph " + name + "{");
  writer.writeLn("node [shape=box, fontname=Consolas, fontsize=11];");

  order.forEach(function (node) {
    var color = node.loop || node.inLoop ? ", color=red" : "";
    writer.writeLn("block_" + idFn(node) + " [label=\"" + nameFn(node) + "\"" + color + "];");
  });

  order.forEach(function (node) {
    succFns.forEach(function (succFn) {
      succFn.fn(node).forEach(function (succ) {
        var edge = "block_" + idFn(node) + " -> " + "block_" + idFn(succ);
        writer.writeLn(edge + succFn.style + ";");
      });
    });
  });

  if (postHook) {
    postHook();
  }

  writer.leave("}");
}