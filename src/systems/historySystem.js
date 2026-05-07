export const undoStack = []
export const redoStack = []

export function executeCommand(command){
  command.execute()
  undoStack.push(command)
  redoStack.length = 0
}

export function undo(){
  const cmd = undoStack.pop()

  if(!cmd) return

  cmd.undo()
  redoStack.push(cmd)
}

export function redo(){
  const cmd = redoStack.pop()

  if(!cmd) return

  cmd.execute()
  undoStack.push(cmd)
}
