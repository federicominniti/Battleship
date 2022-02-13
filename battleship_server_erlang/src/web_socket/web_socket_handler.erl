%%%-------------------------------------------------------------------
%%% @author Federico Minniti, Tommaso Baldi, Matteo Del Seppia
%%% @copyright (C) 2022, <group_mbds>
%%% @doc
%%%
%%% @end
%%% Created : 07. feb 2022 19:05
%%%-------------------------------------------------------------------
-module(web_socket_handler).
-author("group_mbds").

%% API
-export([init/2, websocket_init/1, websocket_handle/2, websocket_info/2, terminate/3]).


%% The module cowboy_websocket implements Websocket as a Ranch protocol.
%% It also defines a callback interface for handling Websocket connections.
%% https://ninenines.eu/docs/en/cowboy/2.6/manual/cowboy_websocket/

%% Note: CowBoy uses different processes for handling the connection and the requests, so they will have different PID.
%% Indeed, we will have one process that handles the requests for each client

init (Req, State) ->
  {cowboy_websocket, Req, State,
    #{idle_timeout => infinity}
  }.

%% https://ninenines.eu/docs/en/cowboy/2.4/guide/ws_handlers/
websocket_init (State) ->
  {ok, State}.



%% The websocket_info/2 callback is called when we use the ! operator
%% So Cowboy will call websocket_info/2 whenever an Erlang message arrives.
websocket_info (stop, State) ->
  {stop, State}; %% Say to the server to terminate the connection

%% This function can be used to send a message Info to this process by another process
websocket_info(Info, State) ->
  {[{text, Info}], State}. %% Returns this message to the client

%% The websocket_handle/2 callback is called when cowboy receive a frame from the client
websocket_handle ({text, Text}, State) ->
  io:format("Frame received: ~p\n", [Text]),
  %% decode parses a json text (a utf8 encoded binary) and produces an erlang term
  TextAsMap = jsx:decode(Text, [return_maps]),
  TypeOfMessage = erlang:binary_to_atom(maps:get(<<"type">>, TextAsMap)), %% << ... >> is the syntax for bit string, we cast it into an atom
  SenderName = erlang:binary_to_atom(maps:get(<<"sender">>, TextAsMap)),
  case TypeOfMessage of
    %% Registration of this process with the atom of the username, this is useful for contacting him from other processes
    user_online ->
      SenderPID = whereis(SenderName),
      if
        SenderPID =/= undefined ->
          ResponseAsText = jsx:encode(#{<<"type">> => <<"logged_sender_error">>}),
          NewState = State,
          self() ! ResponseAsText;
        true ->
          register(erlang:binary_to_atom(maps:get(<<"data">>, TextAsMap)), self()),
		  %ProcessInfo = process_info(self(), registered_name),
		  %NameProcess = element(2, ProcessInfo),
		  NameProcess = erlang:binary_to_atom(maps:get(<<"data">>, TextAsMap)),
		  online_users ! {NameProcess, {update_online_user, add}},
		  NewState = {waiting_opponent, State}
      end;
    opponent_registration ->
		online_users ! {SenderName, {update_online_user, user_in_game}},
      	NewState = {opponent_user, erlang:binary_to_atom(maps:get(<<"data">>, TextAsMap))}; %% register the opponent in the state
	  
    
	random_opponent ->
		online_users ! {SenderName, search_random_opponent},
		NewState = {search_random_opponent, SenderName};
	
	_ -> %% all the other types of message [battleship_request, battleship_accepted, list_update, chat_message, ready, shoot, miss, hit, sunk]
      NewState = State,
      Receiver = erlang:binary_to_atom(maps:get(<<"receiver">>, TextAsMap)),
	  %io:fwrite("~w~n", [NewState]),
      ReceiverPID = whereis(Receiver),
      if
        ReceiverPID == undefined -> %% The receiver is disconnected
          Response = jsx:encode(#{<<"type">> => <<"receiver_left_game">>}), %RIVEDERE PERCHE NON E GESTITO
          SenderName ! Response;
        true -> %% No problem
          Receiver ! Text %% send the JSON structure to the receiver
      end
  end,
  {ok, NewState};

websocket_handle (_, State) -> {ok, State}.

%% terminate/3 is for handling the termination of the connection
%% The first argument is the reason for the closing
%% The most common reasons are stop and remote
%% stop -> The server close the connection
%% remote -> The client close the connection

%% In case of termination in a game page
terminate (TerminateReason, _Req, {opponent_user, OpponentUsername}) ->
  io:format("Terminate reason: ~p\n", [TerminateReason]),
  OpponentPID = whereis(OpponentUsername),
  if
    OpponentPID =/= undefined -> %% The opponent is not already disconnected
      OpponentPID ! jsx:encode(#{<<"type">> => <<"opponent_disconnected">>});
    true ->
      ok
  end;
  
terminate (TerminateReason, _Req, {search_random_opponent, User}) ->
	online_users ! {User, {update_online_user, remove}},
  	io:format("~s found an opponent\n", [User]),
  	io:format("Terminate reason: ~p\n", [TerminateReason]);
  

%% In case of termination in a waiting room
terminate (TerminateReason, _Req, {waiting_opponent, State}) ->
  % Name = element(2, erlang:process_info(self(), registered_name)),
  ProcessInfo = process_info(self(), registered_name),
  NameProcess = element(2, ProcessInfo),
  online_users ! {NameProcess, {update_online_user, remove}},
  io:format("Terminate reason: ~p\n", [TerminateReason]);

terminate (TerminateReason, _Req, {}) ->
  io:format("Terminate reason: ~p\n", [TerminateReason]),
  io:format("Terminate with empty state ~n").
